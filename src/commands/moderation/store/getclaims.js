const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const multiplierSchema = require("../../../schemas/xpmultiplier");
const canvaCord = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("viewclaims")
    .setDescription("View all daily and weekly active claims in the server."),
  async execute(interaction) {
    await interaction.deferReply();

    const { guild } = interaction;

    const rewardSchema = require("../../../schemas/reward");
    const results = await rewardSchema
      .find({ GuildId: guild.id, Time: "daily" })
      .sort({ Amount: -1 });

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Active Claims`)
      .setDescription(`There are no daily claims active at this time...`)
      .setTimestamp()
      .setFooter({ text: "Store" });
    if (results.length == 0)
      return await interaction.update({ embeds: [embed1] });
    let roles = "";
    let amount = "";

    for (const result of results) {
      const role = guild.roles.cache.get(result.Role);
      roles += `${role} \n`;
      amount += result.Amount + " <:faith:1081970270564257912> \n";
    }

    const embedActiveDailyClaims = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Active Claims`)
      .setDescription(`Overview of active daily claims in the server`)
      .addFields(
        { name: "Roles", value: roles, inline: true },
        { name: "Amount", value: amount, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: "Role store" });

    const buttonDaily = new ButtonBuilder()
      .setCustomId("view-daily-claims-button")
      .setLabel("Daily")
      .setStyle(ButtonStyle.Primary);

    const buttonWeekly = new ButtonBuilder()
      .setCustomId("view-weekly-claims-button")
      .setLabel("Weekly")
      .setStyle(ButtonStyle.Primary);

    const buttons = new ActionRowBuilder()
      .addComponents(buttonDaily)
      .addComponents(buttonWeekly);

    return await interaction.editReply({
      embeds: [embedActiveDailyClaims],
      components: [buttons],
    });
  },
};
