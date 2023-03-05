const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId } = process.env;
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const inCommands = fs.readdirSync(`./src/commands/${folder}`);
      for (const newFolder of inCommands) {
        const commandFiles = fs
          .readdirSync(`./src/commands/${folder}/${newFolder}`)
          .filter((file) => file.endsWith(".js"));
        const { commands, commandArray } = client;
        for (const file of commandFiles) {
          const command = require(`../../commands/${folder}/${newFolder}/${file}`);
          client.commands.set(command.data.name, command);
          commandArray.push(command.data.toJSON());
        }
      }
    }
    const rest = new REST({ version: "9" }).setToken(process.env.token);
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: client.commandArray,
      });

      console.log("Successfully reloaded application (/) commands");
    } catch (error) {
      console.error(error);
    }
  };
};
