const { SlashCommandBuilder } = require("discord.js");
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
    ),
  async execute(interaction, client) {
    interaction.deferReply();
    if (interaction.options.getSubcommand() === "roles") {
      //do rol
      const data = await shopSchema.findMany({
        Guild: guild.id,
        User: member.id,
      });
    } else if (interaction.options.getSubcommand() === "whitelists") {
      //send embed for whitelists
    }

    await interaction.editReply({ content: "Pong! " });
  },
};
