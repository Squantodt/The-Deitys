const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: "store-whitelists-button",
  },
  async execute(interaction, client) {
    const shopSchema = require("../../schemas/shop");
    const { guild } = interaction;
    const data = await shopSchema.find({
      Guild: guild.id,
    });

    const results = data.filter((data) => data.Cat == "Whitelists");

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Whitelist Store!`)
      .setDescription(`Nothing to see here yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });

    if (results.length == 0)
      return await interaction.update({ embeds: [embed1] });
    let names = "";
    let prices = "";
    let amount = "";

    for (const result of results) {
      names += result.Name + "\n";
      prices += result.Price + "<:faith:1081970270564257912>" + "\n";
      amount += result.Amount + "\n";
    }

    const embedWlStore = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Role Store`)
      .setDescription(`Overview of whitelists available for purchase`)
      .addFields(
        { name: "Proj Name", value: names, inline: true },
        { name: "Price", value: prices, inline: true },
        { name: "Remaining", value: amount, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: "Role store" });

    return await interaction.update({ embeds: [embedWlStore] });
  },
};
