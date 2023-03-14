const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const storeSchema = require("../../../schemas/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("store-restock-items")
    .setDescription("Restock the shop with items.")
    .addStringOption((option) =>
      option.setName("name").setDescription("Item name").setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of items available (use -1 for infinite)")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("price")
        .setDescription("Amount of Faith to pay")
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
    const category = "Items";
    const name = interaction.options.getString("name");
    const price = interaction.options.getInteger("price");
    const amount = interaction.options.getInteger("amount");
    let tokens = 0;

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Tokens have been restocked!`)
      .setDescription(
        `You have successfully restocked item: ${amount} x ${name} for ${price} <:faith:1081970270564257912>`
      )
      .setTimestamp()
      .setFooter({ text: "Product restock" });

    storeSchema.findOne(
      {
        Guild: guild.id,
        Category: category,
        Name: name,
      },
      async (err, data) => {
        if (err) throw err;
        if (!data) {
          //
          const role = await guild.roles.create({ name: name });

          return await storeSchema.create({
            Guild: guild.id,
            Name: name,
            Cat: category,
            Price: price,
            Amount: amount,
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
