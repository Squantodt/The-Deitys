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
    .setDescription("Restock the shop with tokens users can buy with XP."),
  async execute(interaction) {
    await interaction.deferReply();

    const perm = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: You don't have permissions to restock the shops`
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
      ]);

    await interaction.editReply({
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },
};
