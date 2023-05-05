const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const levelSchema = require("../../../schemas/level");
const canvaCord = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Gets a members rank in the server")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The member you want to check the rank of")
        .setRequired(false)
    ),
  async execute(interaction) {
    const { options, user, guild } = interaction;

    const Member = options.getMember("user") || user;

    const member = guild.members.cache.get(Member.id);

    const data = await levelSchema.findOne({
      Guild: guild.id,
      User: member.id,
    });

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(`:white_check_mark: ${member} has not gained any XP yet`);
    if (!data) return await interaction.reply({ embeds: [embed] });

    await interaction.deferReply();
    const requiredXP = data.Level * data.Level * 20 + 20;

    const rank = new canvaCord.Rank()
      .setAvatar(member.displayAvatarURL({ forceStatic: true }))
      .setBackground("IMAGE", "https://i.imgur.com/tXs59fW.png")
      .setCurrentXP(data.XP)
      .setRequiredXP(requiredXP)
      .setRank(1, "Rank", false)
      .setLevel(
        data.Level,
        `Tot. XP: ${data.TotalXP}            Level                                    `
      )
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator);

    const card = await rank.build();

    const attachment = new AttachmentBuilder(card, { name: "rank.png" });

    const embed2 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`${member.user.username}'s Level`)
      .setImage("attachment://rank.png");

    await interaction.editReply({
      embeds: [embed2],
      files: [attachment],
    });
  },
};
