const { google } = require('googleapis');
const { spreadsheetId, spreadsheetRanges } = require('../../../config.json');
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require('discord.js');

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
            interaction.deferReply({MessageFlags: MessageFlags.Ephemeral})

            const sheet = await googleSheets.spreadsheets.values.batchGet({
                auth: googleSheets.auth,
                spreadsheetId,
                ranges: spreadsheetRanges,
            });

            const [c, d, e, j, k, l] = sheet.data.valueRanges.map(col => col.values.map(v => v[0] || ''));
            
            const maxLength = Math.max(c.length, d.length, e.length, j.length, k.length, l.length);

            var userName = interaction.options.getString('user');

            var weeklyTokens = "Loading...";
            var totalTokens = "Loading...";
            
            if (userName == null) {
                userName = interaction.member.nick.split("[")[0].replace(/\s+/g, "");   
            }

            for (let i = 0; i < maxLength; i++) {
                if (c[i] !== undefined && c[i] !== '' &&
                    d[i] !== undefined && d[i] !== '' &&
                    e[i] !== undefined && e[i] !== '') {

                    const sheetName = c[i].split("(")[0].replace(/\s+/g, "");

                    if (sheetName === userName) {
                        weeklyTokens = d[i];
                        totalTokens = e[i];
                    }
                }
                if (j[i] !== undefined && j[i] !== '' &&
                    k[i] !== undefined && k[i] !== '' &&
                    l[i] !== undefined && l[i] !== '') {
                        
                    const sheetName = j[i].split("(")[0].replace(/\s+/g, "");

                    if (sheetName === userName) {
                        weeklyTokens = j[i];
                        totalTokens = l[i];
                    }
                }
                
                const embed = new EmbedBuilder()
                    .setTitle('🎖️ Token Summary')
                    .setColor(0x3498db) // A calm blue, change as you like
                    .addFields(
                        { name: 'Weekly Tokens', value: `\`${weeklyTokens}\``, inline: true },
                        { name: 'Total Tokens', value: `\`${weeklyTokens}\``, inline: true }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed], MessageFlags: MessageFlags.Ephemeral});
            }
        } catch (error) {
            console.warn(`userinfo.js ! Catched Error "${error}"`);
        }
        
    }
};