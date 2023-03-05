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
const unhandledSchema = require("../../schemas/unhandledwl");
const shopSchema = require("../../schemas/shop");

module.exports = {
  data: {
    name: `walletmodal`,
  },
  async execute(interaction, client) {
    //get inputs
    const address = interaction.fields.getTextInputValue("wallet");
    const { message, guild, user } = interaction;

    //get user unhandled wl and delete
    const unhandledItem = await client.getUnhandled(user.id, guild.id);

    console.log(unhandledItem);
    const channel = client.channels.cache.get(unhandledItem.channelId);

    channel.send(`Their wallet address is: ${address}`);

    //return good message
    const successEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Purchase completed")
      .setDescription(`You have successfully bought this whitelist`);

    return await interaction.update({
      embeds: [successEmbed],
      components: [],
    });

    await interaction.reply({
      content: `You stated your wallet address is ${interaction.fields.getTextInputValue(
        "wallet"
      )}`,
    });
  },
};
