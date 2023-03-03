module.exports = {
  data: {
    name: `walletmodal`,
  },
  async execute(interaction, client) {
    //get inputs
    const address = interaction.fields.getTextInputValue("wallet");
    console.log(interaction);

    //return good message
    const successEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Purchase completed")
      .setDescription(
        `You have successfully bought role: ${item.Name} for ${item.Price} Belief.`
      );

    return await interaction.update({
      embeds: [successEmbed],
      components: [],
    });

    await interaction.reply({
      content: `You stated your wallet address is ${interaction.fields.getTextInputValue(
        "wallet"
      )}`,
    });
  },
};
