const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");
const { execute } = require("../../events/client/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purchase")
    .setDescription("Return a select menu"),
  async execute(interaction, client) {
    await interaction.deferReply();

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`purchase-menu`)
      .setPlaceholder("Select what you want to purchase:")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions([
        {
          label: "Tokens",
          description: "Purchase tokens from the shop",
          value: "Tokens",
        },
        {
          label: "Roles",
          description: "Purchase roles from the shop",
          value: "Roles",
        },
        {
          label: "Whitelists",
          description: "Purchase whitelists from the shop",
          value: "Whitelists",
        },
      ]);

    await interaction.editReply({
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },
};
