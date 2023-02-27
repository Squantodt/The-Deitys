const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const storeSchema = require("../../schemas/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop-restock")
    .setDescription("Restock the shop with roles and whitelists.")
    .addStringOption((option) =>
      option.setName("name").setDescription("Product name").setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("category")
        .setRequired(true)
        .setDescription("The category of the product")
        .addChoices(
          { name: "Roles", value: "Roles" },
          { name: "Whitelists", value: "Whitelists" }
        )
        .setRequired(true)
    )

    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of product you want to restock")
        .setRequired(true)
    )

    .addNumberOption((option) =>
      option
        .setName("price")
        .setDescription("Price of product")
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
    const category = interaction.options.getString("category");
    const name = interaction.options.getString("name");
    const price = interaction.options.getNumber("price");
    const amount = interaction.options.getInteger("amount");
    console.log("more test");
    storeSchema.findOne(
      {
        Guild: guild.id,
        Category: category,
        Name: name,
      },
      async (err, data) => {
        if (err) throw err;
        if (!data) {
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

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Product has been restocked!`)
      .setDescription(
        `You have successfully restocked ${amount} ${category} with name ${name} for ${price} tokens`
      )
      .setTimestamp()
      .setFooter({ text: "Product restock" });
    return await interaction.editReply({ embeds: [embed] });
  },
};
