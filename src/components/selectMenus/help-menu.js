const fs = require("fs");
const path = require("path");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: `help-menu`,
  },
  async execute(interaction, client) {
    const choice = interaction.values[0];
    let choiceName = "";
    let commandString = "";
    let commandDescription = "";
    let commandPath = "";

    if (choice == 1) {
      choiceName = "Community Rank";
      commandPath = "./src/commands/community/rank";
    } else if (choice == 2) {
      choiceName = "Community Store";
      commandPath = "./src/commands/community/store";
    } else if (choice == 3) {
      choiceName = "Moderation Rank";
      commandPath = "./src/commands/moderation/rank";
    } else if (choice == 4) {
      choiceName = "Moderation Store";
      commandPath = "./src/commands/moderation/store";
    }

    const commandFiles = fs
      .readdirSync(commandPath)
      .filter((file) => file.endsWith(".js"));
    const { commands, commandArray } = client;
    for (const file of commandFiles) {
      const command = require(path.resolve(`${commandPath}/${file}`));
      commandString += command.data.name + "\n";
      commandDescription += command.data.description + "\n";
    }

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`${choiceName} Help`)
      .setDescription(`Get help with these commands`)
      .addFields(
        {
          name: "Commands",
          value: `${commandString}`,
          inline: true,
        },
        {
          name: "Description",
          value: `${commandDescription}`,
          inline: true,
        }
      );

    await interaction.update({
      embeds: [embed],
    });
  },
};
