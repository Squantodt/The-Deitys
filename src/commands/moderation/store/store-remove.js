const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  PermissionsBitField,
} = require("discord.js");
const storeSchema = require("../../../schemas/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("store-remove")
    .setDescription("Remove item from the shop."),
  async execute(interaction) {
    await interaction.deferReply();

    const perm = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: You don't have permissions to remove itoms from the shop`
      );
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.editReply({ embeds: [perm], ephemeral: true });

    //return same select menu as purchase, then delete:
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`shop-remove-menu`)
      .setPlaceholder("Select what you want to remove:")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions([
        {
          label: "Tokens",
          description: "Remove tokens from the shop",
          value: "Tokens",
        },
        {
          label: "Roles",
          description: "Remove roles from the shop",
          value: "Roles",
        },
        {
          label: "Whitelists",
          description: "Remove whitelists from the shop",
          value: "Whitelists",
        },
        {
          label: "Items",
          description: "Remove whitelists from the shop",
          value: "Items",
        },
      ]);

    await interaction.editReply({
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },
};
