const shopSchema = require("../../schemas/shop");
const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: `purchase-roles-menu`,
  },
  async execute(interaction, client) {
    await interaction.deferReply();
    const { guild } = interaction;
    const data = await shopSchema.find({
      Guild: guild.id,
    });

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Role Store!`)
      .setDescription(`Nothing to see here yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });

    if (interaction.values[0] === "Tokens") {
      const shopItems =
        "10 tokens \n" + "30 tokens \n" + "70 tokens \n" + "100 tokens";
      const prices =
        "5 levels \n" + "7 levels \n" + "10 levels \n" + "13 levels";
      const tokenMenu = new StringSelectMenuBuilder()
        .setCustomId(`purchase-token-menu`)
        .setPlaceholder("Buy tokens")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
          {
            label: "10 tokens | 5 levels",
            description: "Get 10 tokens for 5 levels",
            value: "10",
          },
          {
            label: "30 tokens | 7 levels",
            description: "Get 30 tokens for 7 levels",
            value: "30",
          },
          {
            label: "70 tokens | 10 levels",
            description: "Get 70 tokens for 10 levels",
            value: "70",
          },
          {
            label: "100 tokens | 13 levels",
            description: "Get 100 tokens for 13 levels",
            value: "100",
          },
        ]);
      return await interaction.editReply({
        components: [new ActionRowBuilder().addComponents(tokenMenu)],
      });
    } else if (interaction.values[0] === "Roles") {
      if (data.length == 0)
        return await interaction.editReply({ embeds: [embed1] });

      const results = data.filter((data) => data.Cat == "Roles");

      let menuOptions = "";

      for (const result of results) {
        menuOptions += `{ label: "${result.Name} for ${result.Price} tokens", value: ${result.Name}},`;
      }

      const roleMenu = new StringSelectMenuBuilder()
        .setCustomId(`purchase-roles-menu`)
        .setPlaceholder("Purchase roles")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([menuOptions]);

      return await interaction.editReply({ embeds: [roleMenu] });
    } else if (interaction.values[0] === "Whitelists") {
      if (data.length == 0)
        return await interaction.editReply({ embeds: [embed1] });

      const results = data.filter((data) => data.Cat == "Whitelists");
      let menuOptions = "";

      for (const result of results) {
        menuOptions += `{ label: "${result.Name} for ${result.Price} tokens", value: ${result.Name}},`;
      }

      const whitelistMenu = new StringSelectMenuBuilder()
        .setCustomId(`purchase-wl-menu`)
        .setPlaceholder("Purchase whitelists")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([menuOptions]);

      return await interaction.editReply({ embeds: [whitelistMenu] });
    }
  },
};
