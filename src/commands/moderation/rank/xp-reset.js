const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const levelSchema = require("../../../schemas/level");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp-reset")
    .setDescription("Resets ALL of the servers XP levels"),
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

    levelSchema.deleteMany({ Guild: guildId }, async (err, data) => {
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(
          `:white_check_mark: The XP system in your server has been reset!`
        );

      await interaction.reply({ embeds: [embed] });
    });
  },
};
