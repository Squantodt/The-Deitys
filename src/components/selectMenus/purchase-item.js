const shopSchema = require("../../schemas/shop");
const walletSchema = require("../../schemas/wallet");
const levelSchema = require("../../schemas/level");
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const shop = require("../../schemas/shop");

module.exports = {
  data: {
    name: `purchase-item`,
  },
  async execute(interaction, client) {
    const { guild, user } = interaction;
    const item = await shopSchema.findOne({
      _id: interaction.values[0],
    });
    const wallet = await walletSchema.findOne({
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
        return await interaction.update({ embeds: [poorEmbed] });

      userLevel.TotalXP -= item.Price;

      //recalculate level based on XP left
      let requiredXP = userLevel.Level * userLevel.Level * 20 + 20;
      userLevel.XP = user.TotalXP ?? 0;
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
        await shopSchema.deleteOne(item);
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
        return await interaction.update({ embeds: [poorEmbed] });

      if (interaction.values[0] === "Whitelists") {
        //Take coins
        wallet.Coins -= item.Price;
        await wallet.save();

        //Purchase whitelist

        //Delete item if amount = 0
        item.Amount -= 1;
        if (item.Amount === 0) {
          await shopSchema.deleteOne(item);
        } else {
          item.save();
        }
      } else if (interaction.values[0] == "Roles") {
        //Take coins
        wallet.Coins -= item.Price;
        await wallet.save();

        //Give role

        //Delete item if amount = 0
        item.Amount -= 1;
        if (item.Amount === 0) {
          await shopSchema.deleteOne(item);
        } else {
          item.save();
        }
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
