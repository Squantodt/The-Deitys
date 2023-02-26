const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const levelSchema = require("../../schemas/level");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xpuser-reset")
    .setDescription("Resets a members XP")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The member you want to clear the XP of")
        .setRequired(true)
    ),
  async execute(interaction) {
    const perm = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: You don't have permissions to reset XP levels in this server!`
      );

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    const { guildId } = interaction;
    const target = interaction.options.getUser("user");

    levelSchema.deleteOne(
      { Guild: guildId, user: target.id },
      async (err, data) => {
        const embed = new EmbedBuilder()
          .setColor("Blue")
          .setDescription(
            `:white_check_mark: ${target.tag}'s XP has been reset!`
          );

        await interaction.reply({ embeds: [embed] });
      }
    );
  },
};
