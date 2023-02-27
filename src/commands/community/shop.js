const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
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
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    await interaction.editReply({ content: "Pong! " });
  },
};
