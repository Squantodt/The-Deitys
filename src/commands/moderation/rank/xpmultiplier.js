const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  roleMention,
} = require("discord.js");
const { updateMultiplier } = require("../../../helperFunctions/xpmultiplier");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xpmultiplier")
    .setDescription("Creates an XP multiplier")
    .addNumberOption((option) =>
      option
        .setName("factor")
        .setDescription("number by which to multiply")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("roleid")
        .setDescription("role to apply this multiplier to")
        .setRequired(false)
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
    const role = interaction.options.getString("roleid")
      ? interaction.options.getString("roleid")
      : false;

    if (!role) {
      if (multiplier < 1) multiplier = 1;
      client.setXP(multiplier);

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(
          `:white_check_mark: The XP system in your server has been updated! XP multiplier is now ${multiplier}`
        );

      await interaction.editReply({ embeds: [embed] });
    } else {
      const { guild } = interaction;
      const filter = { Role: role };
      const update = { Multiplier: multiplier };
      const roleName = guild.roles.cache.get(role);
      await updateMultiplier(filter, update);
      if (typeof roleName === "undefined") {
        const unknownRoleEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `:warning: This role could not be found in this server, please ensure the roleID is correct`
          );
        return interaction.editReply({ embeds: [unknownRoleEmbed] });
      }

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(
          `:white_check_mark: The XP system in your server has been updated! XP multiplier for role: ${roleName} is now ${multiplier}`
        );

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
