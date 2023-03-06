const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const walletSchema = require("../../../schemas/wallet");
const canvaCord = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Gets a members wallet balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The member you want to check the balance of")
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const { options, user, guild } = interaction;

    const Member = options.getMember("user") || user;

    const member = guild.members.cache.get(Member.id);

    const data = await walletSchema.findOne({
      Guild: guild.id,
      User: member.id,
    });

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: ${member} has not earned any coins yet...`
      );
    if (!data) return await interaction.editReply({ embeds: [embed] });
    const embed2 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`${member.user.username}'s balance`)
      .setDescription(`${data.Coins} <:faith:1081970270564257912>`);

    await interaction.editReply({
      embeds: [embed2],
    });
  },
};
