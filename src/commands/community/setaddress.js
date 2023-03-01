const { author } = require("canvacord");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { execute } = require("../../events/client/ready");
const walletSchema = require("../../schemas/wallet");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setaddress")
    .setDescription("Enter your wallet address for the purchase of whitelists.")
    .addStringOption((option) =>
      option
        .setName("walletaddress")
        .setDescription("Your eth wallet address")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const message = await interaction.deferReply({ ephemeral: true });

    const address = interaction.options.getString("walletaddress");
    const { user, guild } = interaction;

    walletSchema.findOne(
      {
        Guild: guild.id,
        User: user.id,
      },
      async (err, data) => {
        if (err) throw err;

        if (!data) {
          await walletSchema.create({
            Guild: guild.id,
            User: user.id,
            Coins: 0,
            Address: address,
          });
        } else {
          data.Address = address;
          await data.save();
        }
      }
    );
    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(`Your wallet address is now: ${address}`);
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  },
};
