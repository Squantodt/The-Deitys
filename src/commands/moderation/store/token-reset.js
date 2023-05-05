const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const walletSchema = require("../../../schemas/wallet");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("token-reset")
    .setDescription("Resets a members Faith balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The member you want to clear the token balance of")
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

    walletSchema.deleteOne(
      { Guild: guildId, User: target.id },
      async (err, data) => {
        const embed = new EmbedBuilder()
          .setColor("Blue")
          .setDescription(
            `:white_check_mark: ${target.tag}'s Faith balance has been reset!`
          );

        await interaction.reply({ embeds: [embed] });
      }
    );
  },
};
