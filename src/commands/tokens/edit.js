const { google } = require('googleapis');
const { spreadsheetId, spreadsheetRanges } = require('../../../config.json');
const { ApplicationCommandOptionType, MessageFlags } = require('discord.js');

module.exports = {
    name: 'edit',
    description: 'Add/remove someone from the token sheet',
    // devOnly: true,
    // testOnly: true,
    barcOnly: true,
    leadershipOnly: true,
    sheets: true,
    options: [
        {
            name: "users",
            description: "The user(s) to add/remove from the sheet (type out the full username(s), don't ping)",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "reason",
            description: "Reason for adding tokens",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "method",
            description: "How to manage the user(s)",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: "Add", 
                    value: '1',
                },
                {
                    name: "Remove",
                    value: '2'
                }
            ],
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
            
            const newSheet = await googleSheets.spreadsheets.values.batchGet({
                auth: googleSheets.auth,
                spreadsheetId,
                ranges: 'Sheet1!J5:J79',
            });
            
            const [accc] = newSheet.data.valueRanges.map(col =>  Array.from({ length: col.majorDimension === 'ROWS' ? col.range.split('!')[1].split(':')[1].match(/\d+/)[0] : col.values.length }, (_, i) =>
                col.values?.[i]?.[0] ?? ''
            ))
            
            const maxLength = Math.max(c.length, d.length, e.length, j.length, k.length, l.length);
            const max = accc.length

            const method = interaction.options.getString("method");
            const reason = interaction.options.getString("reason");
            const users = interaction.options.getString("users");
            const userArray = users.split(/\s+/);

            const userLength = userArray.length
            let fail = userArray
            let last = 0

            if (method == "1") {
                for (let K = 0; K < userLength; K++) {
                    for (let i = 0; i < max; i++) {

                        if ((accc[i] === undefined || accc[i] === '') && last < i) {
                            last = i
 
                            const rowNumber = i + 4 + 1;

                            googleSheets.spreadsheets.values.update({
                                spreadsheetId,
                                range:`Sheet1!J${rowNumber}:M${rowNumber}`,
                                valueInputOption:"RAW",
                                resource:{values:[[userArray[K], "0", "0", false]]}
                            });

                            fail = fail.filter(item => item.name !== userArray[k])

                            break;
                        }
                    }
                    if (fail.includes(userArray[K])) {
                        interaction.user.send(`The sheet is probably full, I can't add user ${userArray[k]}`)
                    }
                }
            } else if (method == "2") {
                for (let i = 0; i < maxLength; i++) {
                    if (c[i] !== undefined && c[i] !== '' &&
                        d[i] !== undefined && d[i] !== '' &&
                        e[i] !== undefined && e[i] !== '') {

                        var sheetName = c[i].split("(")[0].replace(/\s+/g, "");

                        if (userArray.includes(sheetName)) {
                            const rowNumber = i + 1;

                            googleSheets.spreadsheets.values.update({
                                spreadsheetId,
                                range:`Sheet1!C${rowNumber}:F${rowNumber}`,
                                valueInputOption:"RAW",
                                resource:{values:[["", "0", "0", false]]}
                            });

                            break;
                        }
                    }
                    if (j[i] !== undefined && j[i] !== '' &&
                        k[i] !== undefined && k[i] !== '' &&
                        l[i] !== undefined && l[i] !== '') {

                        var sheetName = j[i].split("(")[0].replace(/\s+/g, "");

                        if (userArray.includes(sheetName)) {
                            const rowNumber = i + 1;

                            googleSheets.spreadsheets.values.update({
                                spreadsheetId,
                                range:`Sheet1!J${rowNumber}:M${rowNumber}`,
                                valueInputOption:"RAW",
                                resource:{values:[["", "0", "0", false]]}
                            });

                            break;
                        }
                    }
                }
            }
    
            if (method === "1") {
                console.log(`> Added Users "${users}" for reason "${reason}"`)
                interaction.reply({content: `Added "${users}" to the token sheet`, flags: MessageFlags.Ephemeral});
            } else if (method === "2") {
                console.log(`> Removed Users "${users}" for reason "${reason}"`)
                interaction.reply({content: `Removed "${users}" to the token sheet`, flags: MessageFlags.Ephemeral});
            }
        } catch (error) {
            console.warn(`!!! catched error "${error}"`);
            interaction.reply({content: "Error..."});
        }
        
    }
};