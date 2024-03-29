const shopSchema = require("../../schemas/shop");
const walletSchema = require("../../schemas/wallet");
const levelSchema = require("../../schemas/level");
const wlSchema = require("../../schemas/whitelist");

const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const shop = require("../../schemas/shop");

module.exports = {
  data: {
    name: `purchase-item`,
  },
  async execute(interaction, client) {
    const { guild, user, member, message } = interaction;
    const item = await shopSchema.findOne({
      _id: interaction.values[0],
    });
    let wallet = await walletSchema.findOne({
      Guild: guild.id,
      User: user.id,
    });
    const userLevel = await levelSchema.findOne({
      Guild: guild.id,
      User: user.id,
    });

    const poorEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Purchase cannot be completed!`)
      .setDescription(`Uh oh it appears you can't afford this yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });

    if (item.Cat === "Tokens") {
      if (userLevel.TotalXP < item.Price)
        return await interaction.update({
          embeds: [poorEmbed],
          components: [],
        });

      userLevel.TotalXP -= item.Price;

      //recalculate level based on XP left
      let requiredXP = userLevel.Level * userLevel.Level * 20 + 20;
      userLevel.XP = userLevel.TotalXP ?? 0;
      userLevel.Level = 0;
      while (userLevel.XP >= requiredXP) {
        userLevel.Level += 1;
        userLevel.XP -= requiredXP;
        requiredXP = userLevel.Level * userLevel.Level * 20 + 20;
      }

      await userLevel.save();

      //add tokens to his wallet
      if (!wallet) {
        wallet = walletSchema.create({
          Guild: guild.id,
          User: user.id,
          Coins: item.Tokens,
        });
      } else if (wallet) {
        wallet.Coins += item.Tokens;
        await wallet.save();
      }

      //Delete item if amount = 0
      item.Amount -= 1;
      if (item.Amount === 0) {
        await shopSchema.deleteOne(item._id);
      } else {
        item.save();
      }

      const successEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Purchase completed")
        .setDescription(
          `You have successfully bought ${item.Tokens} tokens for ${item.Price} XP.`
        );

      return await interaction.update({
        embeds: [successEmbed],
        components: [],
      });
    } else {
      if (!wallet || wallet.Coins < item.Price)
        return await interaction.update({
          embeds: [poorEmbed],
          components: [],
        });

      if (item.Cat === "Whitelists") {
        const userAlreadyBoughtEmbed = new EmbedBuilder()
          .setColor("Blue")
          .setTitle("Purchase failed")
          .setDescription(`You have already bought this whitelist.`);

        //write check if not already purchased

        const data = await wlSchema
          .findOne({
            Guild: guild.id,
            ItemId: item._id,
            User: user.id,
          })
          .exec();

        if (!data) {
          //Take coins
          wallet.Coins -= item.Price;
          await wallet.save();

          await wlSchema.create({
            Guild: guild.id,
            User: user.id,
            ItemId: item._id,
          });

          //Delete item if amount = 0
          item.Amount -= 1;
          if (item.Amount === 0) {
            await shopSchema.deleteOne(item._id);
          } else {
            item.save();
          }
          //give wl role
          const role = guild.roles.cache.find((r) => r.name === item.Name);
          member.roles.add(role).catch(console.error);
        } else {
          return await interaction.update({
            embeds: [userAlreadyBoughtEmbed],
            components: [],
          });
        }

        //Create category if not exists

        const thisGuild = client.guilds.cache.get(guild.id);

        let category = interaction.guild.channels.cache.find(
          (channel) => channel.type == 4 && channel.name == "whitelists"
        );
        if (!category) {
          category = await thisGuild.channels.create({
            name: "whitelists",
            type: ChannelType.GuildCategory,
          });
        }

        //get random numbers:
        const rand = Math.floor(1000 + Math.random() * 9000);

        //create channel in category
        let channel = await thisGuild.channels.create({
          name: `${item.Name}${rand}`,
          type: ChannelType.GuildText,
          parent: category,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: client.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });

        //Save channel in client
        client.addUnhandled(user.id, guild.id, channel.id);

        //send message in there with users tag + whitelist bought
        channel.send(
          `<@${user.id}> has just bought the whitelist: ${item.Name}.`
        );

        //Show modal
        const modal = new ModalBuilder()
          .setCustomId(`walletmodal`)
          .setTitle(`${item.Name}`);

        const txtInput = new TextInputBuilder()
          .setCustomId("wallet")
          .setLabel("Your wallet address:")
          .setRequired(true)
          .setMinLength(42)
          .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(txtInput));

        return await interaction.showModal(modal);
      } else if (item.Cat == "Roles") {
        //write check if role already bought
        const role = guild.roles.cache.find((r) => r.name === item.Name);
        const alreadyPurchasedEmbed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Already purchased")
          .setDescription(
            `It seems like you already have purchased the ${item.Name} role`
          );
        if (member.roles.cache.has(role.id)) {
          return await interaction.update({
            embeds: [alreadyPurchasedEmbed],
            components: [],
          });
        }

        //Take coins
        wallet.Coins -= item.Price;
        await wallet.save();

        //Give role
        member.roles.add(role).catch(console.error);

        //Delete item if amount = 0
        item.Amount -= 1;
        if (item.Amount === 0) {
          await shopSchema.deleteOne(item._id);
        } else {
          item.save();
        }

        const successEmbed = new EmbedBuilder()
          .setColor("Blue")
          .setTitle("Purchase completed")
          .setDescription(
            `You have successfully bought role: ${item.Name} for ${item.Price} <:faith:1081970270564257912>.`
          );

        return await interaction.update({
          embeds: [successEmbed],
          components: [],
        });
      } else if (item.Cat === "Items") {
        const userAlreadyBoughtEmbed = new EmbedBuilder()
          .setColor("Blue")
          .setTitle("Purchase failed")
          .setDescription(`You have already bought this item.`);

        //write check if not already purchased

        const data = await wlSchema
          .findOne({
            Guild: guild.id,
            ItemId: item._id,
            User: user.id,
          })
          .exec();

        if (!data) {
          //Take coins
          wallet.Coins -= item.Price;
          await wallet.save();

          //Delete item if amount = 0
          item.Amount -= 1;
          if (item.Amount === 0) {
            await shopSchema.deleteOne(item._id);
          } else {
            await item.save();
          }
          //give wl role
          const role = guild.roles.cache.find((r) => r.name === item.Name);
          member.roles.add(role).catch(console.error);
        } else {
          return await interaction.update({
            embeds: [userAlreadyBoughtEmbed],
            components: [],
          });
        }

        //Create category if not exists

        const thisGuild = client.guilds.cache.get(guild.id);

        let category = interaction.guild.channels.cache.find(
          (channel) => channel.type == 4 && channel.name == "items"
        );
        if (!category) {
          category = await thisGuild.channels.create({
            name: "items",
            type: ChannelType.GuildCategory,
          });
        }

        //get random numbers:
        const rand = Math.floor(1000 + Math.random() * 9000);

        //create channel in category
        let channel = await thisGuild.channels.create({
          name: `${item.Name}${rand}`,
          type: ChannelType.GuildText,
          parent: category,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: client.user.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });

        //send message in there with users tag + whitelist bought
        channel.send(
          `<@${user.id}> has just bought the following item: ${item.Name}.`
        );

        const embed1 = new EmbedBuilder()
          .setColor("Blue")
          .setTitle(`Item Store`)
          .setDescription(
            `You have successfully bought the following item: ${item.Name}`
          )
          .setTimestamp()
          .setFooter({ text: "Store" });

        return await interaction.update({
          embeds: [embed1],
          components: [],
        });
      }
    }

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Role Store!`)
      .setDescription(`Nothing to see here yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });
  },
};
