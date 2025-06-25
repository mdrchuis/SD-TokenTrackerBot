const { MessageFlags } = require('discord.js');
const { devs, testServer, barcServer, leadership } = require('../../../config.json');
const getAllCommands = require('../../utils/getAllCommands');

module.exports = async (client, googleSheets, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const commands = getAllCommands();

    try {
        const commandObject = commands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) return;
        if (commandObject.devOnly) {
            if (!devs.includes(interaction.user.id)) {
                interaction.reply({
                    content: "! This command can only be used by the developer, for safety reasons",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
        } 

        if (commandObject.testOnly) {
            if (!(interaction.guildId === testServer)) {
                interaction.reply({
                    content: "! This command can only be used in a test server, for safety reasons",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
        }

        if (commandObject.barcOnly) {
            if (!(interaction.guildId === barcServer)) {
                interaction.reply({
                    content: "! This command can only be used in BARC, for safety reasons",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
        }

        if (commandObject.leadershipOnly) {
            if (!leadership.includes(interaction.member.user.id)) {
                interaction.reply({
                    content: "! This command can only be used by company leaderships (CS+), for safety reasons",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "! You're lacking permissions",
                        flags: MessageFlags.Ephemeral,
                    });
                    break;
                }
            }
        }

        console.log(`handleCommands.js > Used Command "${interaction.commandName}", "${interaction.user.username}"`)

        if (commandObject.sheets) {
            await commandObject.callback(client, googleSheets, interaction);
        } else {
            await commandObject.callback(client, interaction);
        }
    } catch (error) {
        console.error(`handleCommands.js ! Catched Error "${error}"`);
    }
};