const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");
const shopSchema = require("../../schemas/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Buy tokens, roles and whitelists")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("roles")
        .setDescription("Exchange your tokens for roles")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("whitelists")
        .setDescription("Exchange your tokens for whitelists.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("tokens")
        .setDescription("Exchange your XP for tokens.")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const { guild } = interaction;
    if (interaction.options.getSubcommand() === "roles") {
      //do rol
      const data = await shopSchema.find({
        Guild: guild.id,
        Cat: interaction.options.getSubcommand(),
      });
      console.log(data);
    } else if (interaction.options.getSubcommand() === "whitelists") {
      //send embed for whitelists
    } else if (interaction.options.getSubcommand() === "tokens") {
      const shopItems =
        "10 tokens \n" + "30 tokens \n" + "70 tokens \n" + "100 tokens";
      const prices =
        "5 levels \n" + "7 levels \n" + "10 levels \n" + "13 levels";

      const embed = new EmbedBuilder()
        .setTitle("Token Shop")
        .setDescription("Buy tokens using your earned levels")
        .setColor("Blue")
        .setFields(
          { name: "Items", value: `${shopItems}`, inline: true },
          { name: "Price", value: `${prices}`, inline: true }
        );

      return await interaction.editReply({ embeds: [embed] });
    }
  },
};
