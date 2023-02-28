const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const walletSchema = require("../../schemas/wallet");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giftcoins")
    .setDescription("Reward members with coins")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The member to gift coins to")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of tokens")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Administrator),
  async execute(interaction) {
    await interaction.deferReply();

    const perm = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: You don't have permission to create money out of thin air`
      );
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.editReply({ embeds: [perm], ephemeral: true });

    const { guild, user } = interaction;
    const Member = interaction.options.getMember("user") || user;

    const member = guild.members.cache.get(Member.id);
    const amount = interaction.options.getNumber("amount");

    const amountEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(`:warning: You need to send more than 0 coins!`);

    if (amount <= 0)
      return await interaction.editReply({
        embeds: [amountEmbed],
        ephemeral: true,
      });

    walletSchema.findOne(
      {
        Guild: guild.id,
        User: member.id,
      },
      async (err, data) => {
        if (err) throw err;
        console.log(data);
        if (!data) {
          await walletSchema.create({
            Guild: guild.id,
            User: member.id,
            Coins: amount,
          });
        } else {
          data.Coins += amount;
          await data.save();
        }
      }
    );

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Gift coins!`)
      .setDescription(
        `You have successfully gifted ${amount} of coins to ${interaction.user.tag}`
      )
      .setTimestamp()
      .setFooter({ text: "Product restock" });

    return await interaction.editReply({ embeds: [embed] });
  },
};
