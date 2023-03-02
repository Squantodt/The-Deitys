const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const wlSchema = require("../../schemas/wlchannel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setwlchannel")
    .setDescription("Sets the channel whitelists will be sent in once finished")
    .addStringOption((option) =>
      option
        .setName("channelid")
        .setDescription(
          "The ID of the channel you wish to add, only 1 is possible"
        )
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const perm = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: You don't have permissions to add a channel!`
      );

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.editReply({ embeds: [perm], ephemeral: true });

    const chan_id = interaction.options.getString("channelid");

    if (client.channels.cache.get(chan_id) === undefined) {
      const perm = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:warning: This channel does not exist!`);
      return await interaction.editReply({ embeds: [perm], ephemeral: true });
    }

    wlSchema.findOne(
      {
        guildId: guild.id,
        channelId: chan_id,
      },
      async (err, data) => {
        if (err) throw err;
        //Purchase whitelist if not bought yet
        if (!data) {
          await wlSchema.create({
            guildId: guild.id,
            channelId: chan_id,
          });
        } else {
          data.channelId = chan_id;
        }
      }
    );

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: Once whitelists are out of stock these will get added here`
      );

    interaction.editReply({ embeds: [embed] });
  },
};
