const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const levelSchema = require("../../schemas/level");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Resets ALL of the servers XP levels"),
  async execute(interaction) {
    const { guild, client } = interaction;
    let text = "";

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(`:white_check_mark: No one is on the leaderboard yet...`);

    const data = await levelSchema
      .find({ Guild: guild.id })
      .sort({
        XP: -1,
        Level: -1,
      })
      .limit(10);

    if (data.length == 0) return await interaction.reply({ embeds: [embed1] });

    await interaction.deferReply();

    for (let counter = 0; counter < data.length; ++counter) {
      let { User, XP, Level } = data[counter];

      const value = (await client.users.fetch(User)) || "Unknown Member";

      const member = value.tag;

      text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level} \n`;

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${interaction.guild.name}'s XP Leaderboard:`)
        .setDescription(`\`\`\`${text}\`\`\``)
        .setTimestamp()
        .setFooter({ text: "XP Leaderboard" });

      interaction.editReply({ embeds: [embed] });
    }
  },
};
