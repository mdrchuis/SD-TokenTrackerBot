const { google } = require('googleapis');
const { spreadsheetId, spreadsheetRanges } = require('../../../config.json');
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    name: 'tokenboard',
    description: 'View the user\'s token',
    //devOnly: true,
    //testOnly: true,
    //barcOnly: true,
    //leadershipOnly: true,
    sheets: true,

    callback: async (client, googleSheets, interaction) => {
        try {
            const sheet = await googleSheets.spreadsheets.values.batchGet({
                auth: googleSheets.auth,
                spreadsheetId,
                ranges: spreadsheetRanges,
            });

            const [c, d, e, j, k, l] = sheet.data.valueRanges.map(col => col.values.map(v => v[0] || ''));
            
            const maxLength = Math.max(c.length, d.length, e.length, j.length, k.length, l.length);

            const format = ["", "0"]

            let podium = [format, format, format]
            let topPodium = [format, format, format]

            for (let i = 0; i < maxLength; i++) {
                if (c[i] !== undefined && c[i] !== '' &&
                    d[i] !== undefined && d[i] !== '' &&
                    e[i] !== undefined && e[i] !== '') {

                    const Weekly = d[i]
                    const Total = e[i]

                    const weekly = Number(Weekly)
                    const total = Number(Total)

                    var sheetName = c[i].split("(")[0].replace(/\s+/g, "");
                        
                    if (podium[0][0] !== sheetName && podium[1][0] !== sheetName && podium[2][0] !== sheetName) {
                        if (weekly > podium[0][1]) {
                            podium[2] = podium[1];
                            podium[1] = podium[0];
                            podium[0] = [sheetName, weekly];
                        } else if (weekly > podium[1][1]) {
                            podium[2] = podium[1];
                            podium[1] = [sheetName, weekly];
                        } else if (weekly > podium[2][1]) {
                            podium[2] = [sheetName, weekly];
                        }
                    }
    
                    if (topPodium[0][0] !== sheetName && topPodium[1][0] !== sheetName && topPodium[2][0] !== sheetName) {
                        if (total > topPodium[0][1]) {
                            topPodium[2] = topPodium[1];
                            topPodium[1] = topPodium[0];
                            topPodium[0] = [sheetName, total];
                        } else if (total > topPodium[1][1]) {
                            topPodium[2] = topPodium[1];
                            topPodium[1] = [sheetName, total];
                        } else if (total > topPodium[2][1]) {
                            topPodium[2] = [sheetName, total];
                        }
                    }
                }
                if (j[i] !== undefined && j[i] !== '' &&
                    k[i] !== undefined && k[i] !== '' &&
                    l[i] !== undefined && l[i] !== '') {


                    const Weekly = k[i]
                    const Total = l[i]

                    const weekly = Number(Weekly)
                    const total = Number(Total)

                    var sheetName = j[i].split("(")[0].replace(/\s+/g, "");

                    console.log(podium[0][0], sheetName)
                        
                    if (podium[0][0] !== sheetName && podium[1][0] !== sheetName && podium[2][0] !== sheetName) {
                        if (weekly > podium[0][1]) {
                            podium[2] = podium[1];
                            podium[1] = podium[0];
                            podium[0] = [sheetName, weekly];
                        } else if (weekly > podium[1][1]) {
                            podium[2] = podium[1];
                            podium[1] = [sheetName, weekly];
                        } else if (weekly > podium[2][1]) {
                            podium[2] = [sheetName, weekly];
                        }
                    }
    
                    if (topPodium[0][0] !== sheetName && topPodium[1][0] !== sheetName && topPodium[2][0] !== sheetName) {
                        if (total > topPodium[0][1]) {
                            topPodium[2] = topPodium[1];
                            topPodium[1] = topPodium[0];
                            topPodium[0] = [sheetName, total];
                        } else if (total > topPodium[1][1]) {
                            topPodium[2] = topPodium[1];
                            topPodium[1] = [sheetName, total];
                        } else if (total > topPodium[2][1]) {
                            topPodium[2] = [sheetName, total];
                        }
                    }
                    
                }
                
            }

            const podiumEmbed = new EmbedBuilder()
                .setTitle('🏆 Weekly Podium')
                .setColor(0xffd700) // Gold
                .addFields(
                    {
                        name: 'Weekly Token Podium',
                        value: podium.map((entry, i) => `**${i + 1}.** ${entry[0]} — \`${entry[1]} tokens\``).join('\n'),
                        inline: false,
                    },
                    {
                        name: 'Total Token Podium',
                        value: topPodium.map((entry, i) => `**${i + 1}.** ${entry[0]} — \`${entry[1]} tokens\``).join('\n'),
                        inline: false,
                    }
                )
                .setFooter({ text: 'Fear the demons!' })
                .setTimestamp();

            await interaction.reply({ embeds: [podiumEmbed], ephemeral: false });
        } catch (error) {
            console.warn(`userinfo.js ! Catched Error "${error}"`);
        }
        
    }
};