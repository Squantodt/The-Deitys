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
    // Find the unhandled object
    const unhandledIndex = client.unhandled.findIndex(
      (user) => user.userId === userId && user.guildId === guildId
    );

    // Remove the unhandled object from the array
    if (unhandledIndex !== -1) {
      const unhandled = client.unhandled.splice(unhandledIndex, 1)[0];
      return unhandled;
    } else {
      return null;
    }
  };
};
