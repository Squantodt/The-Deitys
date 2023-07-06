const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const walletSchema = require("../../../schemas/wallet");
const rewardSchema = require("../../../schemas/reward");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editclaim")
    .setDescription("Edit reward options for daily and weekly claims")
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Time frame in which a claim can be done")
        .setRequired(true)
        .addChoices(
          { name: "Daily", value: "daily" },
          { name: "Weekly", value: "weekly" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("roleid")
        .setDescription("ID of the role to apply this reward to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of tokens to claim")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Administrator),
  async execute(interaction) {
    await interaction.deferReply();

    //admincheck
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

    //variables
    const { guild, user } = interaction;

    const amount = interaction.options.getInteger("amount");
    const time = interaction.options.getString("time");
    const roleID = interaction.options.getString("roleid");
    let newRecord = false;

    //reward over 0 check
    const amountEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription(
        `:warning: You can't reward people by taking away their tokens!`
      );

    if (amount <= 0)
      return await interaction.editReply({
        embeds: [amountEmbed],
        ephemeral: true,
      });

    //get role by name
    const role = guild.roles.cache.get(roleID);
    console.log(role);

    if (typeof role === "undefined") {
      const unknownRoleEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `:warning: This role could not be found in this server, please ensure the roleID is correct`
        );
      return interaction.editReply({ embeds: [unknownRoleEmbed] });
    }

    //save role to db
    rewardSchema.findOne(
      {
        Guild: guild.id,
        Time: time,
        Role: roleID,
      },
      async (err, data) => {
        if (err) throw err;
        if (!data) {
          newRecord = true;
          return await rewardSchema.create({
            GuildId: guild.id,
            Time: time,
            Amount: amount,
            Role: roleID,
          });
        } else {
          data.Amount = amount;
          data.save();
        }
      }
    );

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `You have updated the the ${time} claims for the following role: ${role} to ${amount} <:faith:1081970270564257912>`
      );

    interaction.editReply({
      embeds: [embed],
    });
  },
};
