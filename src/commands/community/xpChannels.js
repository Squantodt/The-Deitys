const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xpchannels")
    .setDescription("View channels XP can be earned in"),
  async execute(interaction, client) {
    await interaction.deferReply();

    const channelManager = require("../../functions/handlers/handleChannels")(
      client
    );
    const channelsArray = await client.getXPChannels(interaction.guild.id);
    if (channelsArray.length === 0) {
      const embed = new EmbedBuilder()
        .setColor("BLUE")
        .setDescription(`No channels have been added yet`);

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    let channelNames = "";
    for (const channel of channelsArray) {
      channelNames += client.channels.cache.get(channel).name + "\n";
    }

    const embed = new EmbedBuilder()
      .setColor("BLUE")
      .setDescription(`List of channels XP can be earned in`)
      .addFields({
        name: "Channel name",
        value: channelNames,
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
