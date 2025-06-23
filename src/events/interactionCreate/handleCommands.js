const { devs, testServer, barcServer, leadership, spreatsheetId, spreadsheetRanges } = require('../../../config.json');
const getAllCommands = require('../../utils/getAllCommands');

const { google } = require("googleapis");
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
    keyFile: "../../../db-credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const sheetsClient = await auth.getClient();
const googleSheets = google.sheets({version: "v4", auth: sheetsClient});

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const commands = getAllCommands();

    try {
        const commandObject = commands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) return;
        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.user.id)) {
                interaction.reply({
                    content: "! This command can only be used by the developer, for safety reasons",
                    ephemeral: true,
                });
                return;
            }
        } 

        if (commandObject.testOnly) {
            if (!(interaction.guildId === testServer)) {
                interaction.reply({
                    content: "! This command can only be used in a test server, for safety reasons",
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.barcOnly) {
            if (!(interaction.guildId === barcServer)) {
                interaction.reply({
                    content: "! This command can only be used in BARC, for safety reasons",
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.leadershipOnly) {
            if (!leadership.includes(interaction.member.user.id)) {
                interaction.reply({
                    content: "! This command can only be used by company leaderships (CS+), for safety reasons",
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "! You're lacking permissions",
                        ephemeral: true,
                    });
                    break;
                }
            }
        }

        if (commandObject.sheets) {
            await commandObject.callback(client, googleSheets, interaction)
        } else {
            await commandObject.callback(client, interaction)
        }
    } catch (error) {
        console.error(`! Catched error "${error}"`)
    }
};