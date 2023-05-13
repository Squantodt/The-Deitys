const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: "store-items-button",
  },
  async execute(interaction, client) {
    const shopSchema = require("../../schemas/shop");
    const { guild } = interaction;
    const data = await shopSchema.find({
      Guild: guild.id,
    });
    const results = data.filter((data) => data.Cat == "Items");

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Item Store!`)
      .setDescription(`Nothing to see here yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });

    if (results.length == 0)
      return await interaction.update({ embeds: [embed1] });
    let roles = "";
    let prices = "";
    let amount = "";

    for (const result of results) {
      let buf = result.Amount;

      if (result.Amount === -1) {
        buf = "infinite";
      }
      roles += result.Name + "\n";
      prices += result.Price + `<:faith:1081970270564257912> \n`;
      amount += buf + "\n";
    }

    const embedRoleStore = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Item Store`)
      .setDescription(`Overview of items available for purchase`)
      .addFields(
        { name: "Items", value: roles, inline: true },
        { name: "Price", value: prices, inline: true },
        { name: "Remaining", value: amount, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: "Role store" });

    return await interaction.update({ embeds: [embedRoleStore] });
  },
};
