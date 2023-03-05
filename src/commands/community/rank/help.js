const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ActionRowBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View all commands!"),
  async execute(interaction, client) {
    await interaction.deferReply();

    let menuOptions = [
      {
        label: `Rank Commands`,
        value: `1`,
      },
      {
        label: `Store Commands`,
        value: `2`,
      },
      {
        label: `Moderator Rank Commands`,
        value: `3`,
      },
      {
        label: `Moderator Rank Commands`,
        value: `4`,
      },
    ];

    const roleMenu = new StringSelectMenuBuilder()
      .setCustomId(`help-menu`)
      .setPlaceholder(`Get help on how to use the bot.`)
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(menuOptions);

    await interaction.editReply({
      components: [new ActionRowBuilder().addComponents(roleMenu)],
    });
  },
};
