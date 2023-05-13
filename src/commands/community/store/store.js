const {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { execute } = require("../../../events/client/ready");
const shopSchema = require("../../../schemas/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Buy tokens, roles and whitelists"),
  async execute(interaction, client) {
    await interaction.deferReply();
    const { guild } = interaction;

    const data = await shopSchema.find({
      Guild: guild.id,
    });

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`The Deitys Discord Store!`)
      .setDescription(`Click a buton to see what's available`)
      .setTimestamp()
      .setFooter({ text: "Store" });

    const buttonItem = new ButtonBuilder()
      .setCustomId("store-items-button")
      .setLabel("Items")
      .setStyle(ButtonStyle.Primary);

    const buttonRole = new ButtonBuilder()
      .setCustomId("store-roles-button")
      .setLabel("Roles")
      .setStyle(ButtonStyle.Primary);

    const buttonWhitelist = new ButtonBuilder()
      .setCustomId("store-whitelists-button")
      .setLabel("Whitelists")
      .setStyle(ButtonStyle.Primary);

    const buttonToken = new ButtonBuilder()
      .setCustomId("store-tokens-button")
      .setLabel("Tokens")
      .setStyle(ButtonStyle.Primary);

    const buttons = new ActionRowBuilder()
      .addComponents(buttonItem)
      .addComponents(buttonRole)
      .addComponents(buttonWhitelist)
      .addComponents(buttonToken);

    return await interaction.editReply({
      embeds: [embed1],
      components: [buttons],
    });
  },
};
