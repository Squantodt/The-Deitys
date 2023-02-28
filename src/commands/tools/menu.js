const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");
const { execute } = require("../../events/client/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Return a select menu"),
  async execute(interaction, client) {
    const message = await interaction.deferReply();

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`menu`)
      .setPlaceholder("Nothing selected...")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions([
        {
          label: "Select me",
          description: "This is a description",
          value: "first_option",
        },
        {
          label: "You can select me too",
          description: "This is also a description",
          value: "second_option",
        },
        {
          label: "I am also an option",
          description: "This is a description as well",
          value: "third_option",
        },
      ]);

    await interaction.editReply({
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },
};
