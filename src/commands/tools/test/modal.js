const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("modal")
    .setDescription("Return a modal!"),
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId(`modal-example`)
      .setTitle(`Example modal`);

    const txtInput = new TextInputBuilder()
      .setCustomId("wallet")
      .setLabel("Your wallet address:")
      .setRequired(true)
      .setMinLength(42)
      .setMaxLength(42);

    modal.addComponents(new ActionRowBuilder().addComponents(txtInput));

    await interaction.showModal(modal);
  },
};
