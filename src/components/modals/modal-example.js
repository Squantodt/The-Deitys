module.exports = {
  data: {
    name: `modal-example`,
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `You stated your wallet address is ${interaction.fields.getTextInputValue(
        "wallet"
      )}`,
    });
  },
};
