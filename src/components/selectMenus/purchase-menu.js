const shopSchema = require("../../schemas/shop");
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: `purchase-menu`,
  },
  async execute(interaction, client) {
    const { guild, message } = interaction;
    const data = await shopSchema.find({
      Guild: guild.id,
    });

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Role Store!`)
      .setDescription(`Nothing to see here yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });

    const results = data.filter((data) => data.Cat == interaction.values[0]);
    console.log(data);
    if (results.length == 0)
      return await interaction.update({ embeds: [embed1], components: [] });

    let menuOptions = [];

    for (const result of results) {
      if (interaction.values[0] === "Tokens") {
        const menuOption = {
          label: `"${result.Tokens} tokens for ${result.Price} XP"`,
          value: `${result._id}`,
        };
        menuOptions.push(menuOption);
      } else {
        const menuOption = {
          label: `"${result.Name} for ${result.Price} tokens"`,
          value: `${result._id}`,
        };
        menuOptions.push(menuOption);
      }
    }

    const roleMenu = new StringSelectMenuBuilder()
      .setCustomId(`purchase-item`)
      .setPlaceholder(`Purchase ${interaction.values[0]}`)
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(menuOptions);

    await interaction.update({
      components: [new ActionRowBuilder().addComponents(roleMenu)],
    });
  },
};
