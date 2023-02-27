const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");

module.exports = {
  data: new SlashCommandBuilder().setName("shop").setDescription("Buy tokens"),
  async execute(interaction, client) {
    const message = await interaction.deferReply();

    const shopItems =
      "10 tokens \n" + "30 tokens \n" + "70 tokens \n" + "100 tokens";
    const prices = "5 levels \n" + "7 levels \n" + "10 levels \n" + "13 levels";

    const embed = new EmbedBuilder()
      .setTitle("Token Shop")
      .setDescription("Buy tokens using your earned levels")
      .setColor("Blue")
      .setFields(
        { name: "Items", value: `${shopItems}` },
        { name: "Price", value: `${prices}` }
      );
  },
};
