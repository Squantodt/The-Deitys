const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: "store-tokens-button",
  },
  async execute(interaction, client) {
    const shopSchema = require("../../schemas/shop");
    const { guild } = interaction;
    const data = await shopSchema.find({
      Guild: guild.id,
    });
    const results = data.filter((data) => data.Cat == "Tokens");

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Token Store!`)
      .setDescription(`Nothing to see here yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });
    let prices = "";

    if (results.length == 0)
      return await interaction.update({ embeds: [embed1] });
    let names = "";
    let shopItems = "";

    for (const result of results) {
      prices += result.Price + " XP" + "\n";
      shopItems += result.Tokens + " <:faith:1081970270564257912> \n";
    }

    const embed = new EmbedBuilder()
      .setTitle("Token Exchange")
      .setDescription("Buy tokens using your earned levels")
      .setColor("Blue")
      .setFields(
        { name: "Items", value: `${shopItems}`, inline: true },
        {
          name: "Price",
          value: `${prices}`,
          inline: true,
        }
      );

    return await interaction.update({ embeds: [embed] });
  },
};
