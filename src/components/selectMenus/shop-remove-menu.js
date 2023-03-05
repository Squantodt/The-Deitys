const shopSchema = require("../../schemas/shop");
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: `shop-remove-menu`,
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
          label: `"${result.Name} for ${result.Price} <:faith:1081970270564257912>"`,
          value: `${result._id}`,
        };
        menuOptions.push(menuOption);
      }
    }

    const roleMenu = new StringSelectMenuBuilder()
      .setCustomId(`remove-item`)
      .setPlaceholder(`Remove ${interaction.values[0]}`)
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(menuOptions);

    await interaction.update({
      components: [new ActionRowBuilder().addComponents(roleMenu)],
    });
  },
};
