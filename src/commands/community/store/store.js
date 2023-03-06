const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { execute } = require("../../../events/client/ready");
const shopSchema = require("../../../schemas/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("store")
    .setDescription("Buy tokens, roles and whitelists")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("roles")
        .setDescription("Exchange your tokens for roles")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("whitelists")
        .setDescription("Exchange your tokens for whitelists.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("tokens")
        .setDescription("Exchange your XP for tokens.")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const { guild } = interaction;
    const subcommand = interaction.options.getSubcommand();

    const data = await shopSchema.find({
      Guild: guild.id,
    });

    const embed1 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Role Store!`)
      .setDescription(`Nothing to see here yet...`)
      .setTimestamp()
      .setFooter({ text: "Store" });

    if (data.length == 0)
      return await interaction.editReply({ embeds: [embed1] });
    if (interaction.options.getSubcommand() === "roles") {
      const results = data.filter((data) => data.Cat == "Roles");
      if (results.length == 0)
        return await interaction.editReply({ embeds: [embed1] });
      let roles = "";
      let prices = "";
      let amount = "";

      for (const result of results) {
        let buf = result.Amount;

        if (result.Amount === -1) {
          buf = "infinite";
        }
        roles += result.Name + "\n";
        prices += result.Price + `<:faith:1081970270564257912> \n`;
        amount += buf + "\n";
      }

      const embedRoleStore = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Role Store`)
        .setDescription(`Overview of roles available for purchase`)
        .addFields(
          { name: "Roles", value: roles, inline: true },
          { name: "Price", value: prices, inline: true },
          { name: "Amount", value: amount, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: "Role store" });

      return await interaction.editReply({ embeds: [embedRoleStore] });
    } else if (interaction.options.getSubcommand() === "whitelists") {
      //send embed for whitelists

      const results = data.filter((data) => data.Cat == "Whitelists");
      if (results.length == 0)
        return await interaction.editReply({ embeds: [embed1] });
      let names = "";
      let prices = "";
      let amount = "";

      for (const result of results) {
        names += result.Name + "\n";
        prices += result.Price + "<:faith:1081970270564257912>" + "\n";
        amount += result.Amount + "\n";
      }

      const embedWlStore = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Role Store`)
        .setDescription(`Overview of roles available for purchase`)
        .addFields(
          { name: "Proj Name", value: names, inline: true },
          { name: "Price", value: prices, inline: true },
          { name: "Amount", value: amount, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: "Role store" });

      return await interaction.editReply({ embeds: [embedWlStore] });
    } else if (interaction.options.getSubcommand() === "tokens") {
      const shopItems =
        "10 tokens \n" + "30 tokens \n" + "70 tokens \n" + "100 tokens";
      const prices =
        "5 levels \n" + "7 levels \n" + "10 levels \n" + "13 levels";

      const embed = new EmbedBuilder()
        .setTitle("Token Shop")
        .setDescription("Buy tokens using your earned levels")
        .setColor("Blue")
        .setFields(
          { name: "Items", value: `${shopItems}`, inline: true },
          {
            name: "Price",
            value: `${prices} <:faith:1081970270564257912>`,
            inline: true,
          }
        );

      return await interaction.editReply({ embeds: [embed] });
    }
  },
};
