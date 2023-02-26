const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xpchanneladd")
    .setDescription("Adds a channel XP can be earned in")
    .addStringOption((option) =>
      option
        .setName("channelid")
        .setDescription("The ID of the channel you wish to add")
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

    const channelManager = require("../../functions/handlers/handleChannels")(
      client
    );
    client.addChannel(interaction.guild.id, chan_id);

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:white_check_mark: This channel has been successfully added`
      );

    interaction.editReply({ embeds: [embed] });
  },
};
