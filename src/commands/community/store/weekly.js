const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const walletSchema = require("../../../schemas/wallet");
const rewardSchema = require("../../../schemas/reward");
const claimSchema = require("../../../schemas/claim");
const canvaCord = require("canvacord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weekly")
    .setDescription("Get the weekly claim for your role"),
  async execute(interaction) {
    await interaction.deferReply();
    const { options, user, guild } = interaction;

    const Member = options.getMember("user") || user;

    const member = guild.members.cache.get(Member.id);

    const walletData = await walletSchema.findOne({
      Guild: guild.id,
      User: member.id,
    });

    const results = await rewardSchema
      .find({ GuildId: guild.id, Time: "weekly" })
      .sort({ Amount: -1 });

    const getDailyRewards = async () => {
      // get all role id's of a user
      // loop over multipliers until 1 is found and return that multiplier
      const member = guild.members.cache.get(Member.id);
      for (const reward of results) {
        if (member._roles.includes(reward.Role)) {
          return reward.Amount;
        }
      }
      return 0;
    };

    const reward = await getDailyRewards();

    const noClaimEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:warning: ${member} does not have a role that can claim rewards`
      );

    if (reward == 0) {
      return await interaction.editReply({ embeds: [noClaimEmbed] });
    }

    // Check if the user has already claimed within the last 24 hours
    const lastClaim = await claimSchema.findOne({
      GuildId: guild.id,
      User: member.id,
      Timeframe: "Weekly",
    });

    const currentTime = new Date();
    const timeRestriction = 24 * 60 * 60 * 1000 * 7; // 1 week in milliseconds

    if (lastClaim && currentTime - lastClaim.date < timeRestriction) {
      // User has already claimed within the time restriction
      const cooldownEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `:hourglass_flowing_sand: ${member}, you can only claim once every week. Please try again later.`
        );
      return await interaction.editReply({ embeds: [cooldownEmbed] });
    }

    // Update the claim record with the current time or create a new claim record
    if (lastClaim) {
      lastClaim.date = currentTime;
      await lastClaim.save();
    } else {
      await claimSchema.create({
        GuildId: guild.id,
        User: member.id,
        Timeframe: "Weekly",
        date: currentTime,
      });
    }

    // Update or create the wallet record if it doesn't exist
    if (walletData) {
      walletData.Coins += reward;
      await walletData.save();
    } else {
      await walletSchema.create({
        Guild: guild.id,
        User: member.id,
        Coins: reward,
      });
    }

    const successEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `:white_check_mark: Claimed ${reward} <:faith:1081970270564257912>`
      );

    return await interaction.editReply({ embeds: [successEmbed] });
  },
};
