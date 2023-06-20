const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const walletSchema = require("../../../schemas/wallet");
const rewardSchema = require("../../../schemas/reward");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editclaim")
    .setDescription("Edit reward options for daily and weekly claims")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Time frame in which a claim can be done")
        .setRequired(true)
        .addChoices(
          { name: "Daily", value: "daily" },
          { name: "Weekly", value: "weekly" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of the role to apply this reward to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of tokens to claim")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Administrator),
  async execute(interaction) {
    await interaction.deferReply();

    const perm = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: You don't have permission to create money out of thin air`
      );
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.editReply({ embeds: [perm], ephemeral: true });

    const { guild, user } = interaction;

    const amount = interaction.options.getInteger("amount");
    const time = interaction.options.getString("time");
    const role = interaction.options.getString("role");

    const amountEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:warning: You can't reward people by taking away their tokens!`
      );

    if (amount <= 0)
      return await interaction.editReply({
        embeds: [amountEmbed],
        ephemeral: true,
      });
  },
};
