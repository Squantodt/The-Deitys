const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: "view-weekly-claims-button",
  },
  async execute(interaction, client) {
    const { guild } = interaction;

    const rewardSchema = require("../../schemas/reward");
    const results = await rewardSchema
      .find({ GuildId: guild.id, Time: "weekly" })
      .sort({ Amount: -1 });

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Active Weekly Claims`)
      .setDescription(`There are no weekly claims active at this time...`)
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
      .setTitle(`Active Weekly Claims`)
      .setDescription(`Overview of active weekly claims in the server`)
      .addFields(
        { name: "Roles", value: roles, inline: true },
        { name: "Amount", value: amount, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: "Role store" });

    return await interaction.update({ embeds: [embedActiveDailyClaims] });
  },
};
