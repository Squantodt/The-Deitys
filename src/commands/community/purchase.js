const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purchase")
    .setDescription("Purchase tokens, whitelists and roles from the store"),
  async execute(interaction, client) {
    const message = await interaction.deferReply();

    const shopItems =
      "10 tokens \n" + "30 tokens \n" + "70 tokens \n" + "100 tokens";
    const prices = "5 levels \n" + "7 levels \n" + "10 levels \n" + "13 levels";

    const embed = new EmbedBuilder()
      .setTitle("Purchase item")
      .setDescription("What do you want to purchase?")
      .setColor("Blue");

    conse;

    await interaction.editReply({ embeds: [embed] });
  },
};
