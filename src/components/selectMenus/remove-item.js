const shopSchema = require("../../schemas/shop");
const walletSchema = require("../../schemas/wallet");
const levelSchema = require("../../schemas/level");
const wlSchema = require("../../schemas/whitelist");

const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const shop = require("../../schemas/shop");

module.exports = {
  data: {
    name: `remove-item`,
  },
  async execute(interaction, client) {
    const item = await shopSchema.findOne({
      _id: interaction.values[0],
    });

    await shopSchema.deleteOne(item._id);

    const successEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Removal completed")
      .setDescription(
        `You have successfully removed this item from the shops.`
      );

    return await interaction.update({
      embeds: [successEmbed],
      components: [],
    });
  },
};
