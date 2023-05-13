const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const multiplierSchema = require("../../../schemas/xpmultiplier");
const canvaCord = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getxpmultipliers")
    .setDescription("Gets all xp multipliers in the server."),
  async execute(interaction) {
    await interaction.deferReply();

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

    const { options, user, guild } = interaction;

    const results = await multiplierSchema
      .find({ GuildId: guild.id })
      .sort({ Multiplier: -1 });

    let roles = "";
    let multipliers = "";

    for (const result of results) {
      const roleName = await guild.roles.cache.get(result.Role);
      roles += `${roleName} \n`;
      multipliers += `${result.Multiplier} \n`;
    }
    roles += "Server multiplier";
    multipliers += `${interaction.client.XP}`;

    const embed2 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Currently active multipliers`)
      .setDescription(
        `Overview of which multipliers are currently active in the server. \nA users has the multiplier of their highest rank.`
      )
      .addFields(
        { name: "Role", value: roles, inline: true },
        { name: "Multiplier", value: multipliers, inline: true }
      );

    await interaction.editReply({
      embeds: [embed2],
    });
  },
};
