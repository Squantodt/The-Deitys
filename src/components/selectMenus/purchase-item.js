const shopSchema = require("../../schemas/shop");
const walletSchema = require("../../schemas/wallet");
const levelSchema = require("../../schemas/level");
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: `purchase-item`,
  },
  async execute(interaction, client) {
    await interaction.deferReply();
    const { guild, user } = interaction;
    const item = await shopSchema.findOne({
      _id: interaction.values[0],
    });
    const wallet = await walletSchema.findOne({
      Guild: guild.id,
      User: user.id,
    });
    const userLevel = await levelSchema.findOne({
      Guild: guild.id,
      User: user.id,
    });
    console.log(item);

    const poorEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Purchase cannot be completed!`)
      .setDescription(`Uh oh it appears you can't afford this yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });

    if (item.Cat === "Tokens") {
      if (userLevel.TotalXP < item.Price) {
        return await interaction.update({ embeds: [poorEmbed] });
      }
    }

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Role Store!`)
      .setDescription(`Nothing to see here yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });
  },
};
