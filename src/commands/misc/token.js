const { google } = require('googleapis');
const { spreadsheetId, spreadsheetRanges } = require('../../../config.json');
const { ApplicationCommandOptionType, MessageFlags } = require('discord.js');

module.exports = {
    name: 'token',
    description: 'Add/remove tokens',
    // devOnly: true,
    // testOnly: true,
    barcOnly: true,
    leadershipOnly: true,
    sheets: true,
    options: [
        {
            name: "amount",
            description: "Amount of tokens to add",
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
        {
            name: "reason",
            description: "Reason for adding event points",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "user",
            description: "Reason for adding event points",
            required: true,
            type: ApplicationCommandOptionType.User,
        },
    ],

    callback: async (client, googleSheets, interaction) => {
        try {
            const sheet = await googleSheets.spreadsheets.values.batchGet({
                auth: googleSheets.auth,
                spreadsheetId,
                ranges: spreadsheetRanges,
            })
    
            interaction.reply({content: `Pong! ${client.ws.ping}ms`, flags: MessageFlags.Ephemeral});
        } catch (error) {
            console.warn("!!! err", error)
        }
        
    }
};