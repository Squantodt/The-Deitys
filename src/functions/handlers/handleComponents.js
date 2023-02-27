const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId } = process.env;
const readdirSync = require("fs");

module.export = (client) => {
  client.handleComponents = async () => {
    const componentFolder = readdirSync("./src/components");
    for (const folder of componentFolder) {
      const componentFiles = readdirSync(`./src/componens/${folder}`).filter(
        (file) => file.endsWith(".js")
      );

      const { buttons } = client;
      switch (folder) {
        case "buttons":
          for (const file of componentFiles) {
            const button = require(`../../components/${folder}/${file}`);
            buttons.set(button.data.name, button);
          }
          break;

        default:
          break;
      }
    }
  };
};
