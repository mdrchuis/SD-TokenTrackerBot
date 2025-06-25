const { google } = require('googleapis');
const { spreadsheetId, spreadsheetRanges } = require('../../../config.json');
const { ApplicationCommandOptionType, MessageFlags } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'View the user\'s token',
    // devOnly: true,
    // testOnly: true,
    barcOnly: true,
    //leadershipOnly: true,
    sheets: true,
    options: [
        {
            name: "user",
            description: "User to get the info from (type out the full username, don't ping)",
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],

    callback: async (client, googleSheets, interaction) => {
        try {
            const sheet = await googleSheets.spreadsheets.values.batchGet({
                auth: googleSheets.auth,
                spreadsheetId,
                ranges: spreadsheetRanges,
            });

            const [c, d, e, j, k, l] = sheet.data.valueRanges.map(col => col.values.map(v => v[0] || ''));
            
            const maxLength = Math.max(c.length, d.length, e.length, j.length, k.length, l.length);

            var userName = interaction.options.getString('user');
            
            if (userName == null) {
                userName = interaction.member.nick.split("[")[0].replace(/\s+/g, "");   
            }

            for (let i = 0; i < maxLength; i++) {
                if (c[i] !== undefined && c[i] !== '' &&
                    d[i] !== undefined && d[i] !== '' &&
                    e[i] !== undefined && e[i] !== '') {

                    const sheetName = c[i].split("(")[0].replace(/\s+/g, "");

                    if (sheetName === userName) {
                        interaction.reply(`Weekly Tokens: ${d[i]}\nTotal Tokens: ${e[i]}`);
                    }
                }
                if (j[i] !== undefined && j[i] !== '' &&
                    k[i] !== undefined && k[i] !== '' &&
                    l[i] !== undefined && l[i] !== '') {
                        
                    const sheetName = j[i].split("(")[0].replace(/\s+/g, "");

                    if (sheetName === userName) {
                            interaction.reply(`Weekly Tokens: ${k[i]}\nTotal Tokens: ${l[i]}`);
                    }
                }
                
            }
        } catch (error) {
            console.warn(`userinfo.js ! Catched Error "${error}"`);
        }
        
    }
};