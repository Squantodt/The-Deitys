const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
} = require("discord.js");
const storeSchema = require("../../schemas/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restock-whitelist")
    .setDescription("Restock the shop with roles and whitelists.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription(
          "Project name. A role will be created under the same name."
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Max amount of spots available..")
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
    const category = "Whitelists";
    const name = interaction.options.getString("name");
    const price = interaction.options.getInteger("price");
    const amount = interaction.options.getInteger("amount");
    let tokens = 0;

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Tokens have been restocked!`)
      .setDescription(
        `You have successfully restocked role: ${amount} x ${name} for ${price} faith`
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
