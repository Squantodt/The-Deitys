const xpChannelsModel = require("../../schemas/xpChannels");
module.exports = (client) => {
  client.addChannel = async (guildId, channelId) => {
    const xpChannel = new xpChannelsModel({
      guildId,
      channelId,
    });

    await xpChannel.save();
  };

  // Remove XP channel from the database
  client.removeChannel = async (guildId, channelId) => {
    await xpChannelsModel.findOneAndDelete({
      guildId,
      channelId,
    });
  };

  // Get XP channels for a guild from the database
  client.getXPChannels = async (guildId) => {
    const xpChannels = await xpChannelsModel.find({
      guildId,
    });
    let channels = [];
    for (const channel of xpChannels) {
      channels.push(channel.channelId);
    }
    return channels;
  };
};
