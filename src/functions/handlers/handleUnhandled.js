module.exports = (client) => {
  //add in client
  client.addUnhandled = async (userId, guildId, channelId) => {
    client.unhandled.push({
      userId: userId,
      guildId: guildId,
      channelId: channelId,
    });
  };

  client.getUnhandled = async (userId, guildId) => {
    return client.unhandled.find(
      (user) => user.userId === userId && user.guildId === guildId
    );
  };
};
