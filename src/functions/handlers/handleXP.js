module.exports = (client) => {
  client.XP = 1;

  // Set XP for a user
  client.setXP = (xp) => {
    client.XP = xp;
  };

  // Get XP for a user
  client.getXP = () => {
    return client.XP || 1;
  };
};
