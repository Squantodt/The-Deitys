const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xpmultiplier")
    .setDescription("Creates an XP multiplier")
    .addNumberOption((option) =>
      option
        .setName("factor")
        .setDescription("number by which to multiply")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const perm = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: You don't have permissions to add an XP multiplier in this server!`
      );

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });
    await interaction.deferReply();

    const multiplier = interaction.options.getNumber("factor");
    if (multiplier < 1) multiplier = 1;
    client.setXP(multiplier);

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: The XP system in your server has been updated! XP multiplier is now ${multiplier}`
      );

    interaction.editReply({ embeds: [embed] });
  },
};
