const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const storeSchema = require("../../../schemas/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("store-restock-tokens")
    .setDescription("Restock the shop with tokens users can buy with XP.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of tokens the user will get")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("price")
        .setDescription("Amount of XP the user as to pay")
        .setRequired(true)
    ),
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

    const { guild } = interaction;
    const category = "Tokens";
    const price = interaction.options.getInteger("price");
    const amount = interaction.options.getInteger("amount");
    let tokens = 0;

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Tokens have been restocked!`)
      .setDescription(
        `You have successfully restocked tokens: ${amount} for ${price} XP`
      )
      .setTimestamp()
      .setFooter({ text: "Product restock" });

    storeSchema.findOne(
      {
        Guild: guild.id,
        Category: category,
        Tokens: amount,
        Price: price,
      },
      async (err, data) => {
        if (err) throw err;
        if (!data) {
          return await storeSchema.create({
            Guild: guild.id,
            Cat: category,
            Price: price,
            Tokens: amount,
            Amount: -1,
          });
        } else {
          data.Amount += amount;
          data.Price = price;
          data.save();
        }
      }
    );
    return await interaction.editReply({ embeds: [embed] });
  },
};
