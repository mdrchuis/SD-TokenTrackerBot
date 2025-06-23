const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'token',
    description: 'Add/remove tokens',
    // devOnly: true,
    // testOnly: true,
    barcOnly: true,
    leadershipOnly: true,
    sheets: true,
    // options: Object[],

    callback: async (client, googleSheets, interaction) => {
        const sheet = await googleSheets.spreadsheets.values.batchGet({
            auth,
            spreatsheetId,
            ranges: spreadsheetRanges,
        })

        interaction.reply({content: `Pong! ${client.ws.ping}ms`, ephemeral: true});
    }
};