const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const shopSchema = require("../../schemas/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop-restock")
    .setDescription("Restock the shop with roles and whitelists.")
    .addStringOption((option) =>
      option
        .setName("category")
        .setRequired(true)
        .addChoices(
          { name: "Role", value: "Role" },
          { name: "WL", value: "Whitelist" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of the product you want to restock")
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of product you want to restock")
    ),
  async execute(interaction) {
    const perm = new EmbedBuilder().setColor(
      "Blue".setDescription(
        `:white_check_mark: You don't have permissions to restock the shops`
      )
    );

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    const { guildId } = interaction;
    const category = interaction.options.getString("category");

    const shopItem = new shopSchema();
  },
};
