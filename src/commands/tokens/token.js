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
            description: "Reason for adding tokens",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "method",
            description: "How to manage the user(s) tokens",
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
        {
            name: "users",
            description: "The user(s) to add tokens to (type out the full username(s), don't ping)",
            required: true,
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

            const method = interaction.options.getString("method");
            const AMOUNT = interaction.options.getNumber("amount");
            const users = interaction.options.getString("users");
            const userArray = users.split(/\s+/);

            for (let i = 0; i < maxLength; i++) {
                if (c[i] !== undefined && c[i] !== '' &&
                    d[i] !== undefined && d[i] !== '' &&
                    e[i] !== undefined && e[i] !== '') {

                    var sheetName = c[i].split("(")[0].replace(/\s+/g, "");

                    if (userArray.includes(sheetName)) {
                        const rowNumber = i + 1;

                        const oldValue = Number(d[i]);
                        var newValue = oldValue  ;
                        const oldTotal = Number(e[i]);
                        var newTotal = oldTotal;

                        var amount = AMOUNT;
                        var isPendingEp;

                        if (method === "1") {
                            if (AMOUNT >= 5) {
                                isPendingEp = Math.floor(AMOUNT / 5)
                                amount += isPendingEp;
                            } else if ((AMOUNT + oldValue) % 5 === 0) {
                                isPendingEp = 1;
                                amount += 1;
                            }
                            newValue = oldValue + amount;
                            newTotal = oldTotal + amount;
                        } else {
                            if (AMOUNT >= 5) {
                                amount += Math.floor(AMOUNT / 5);
                            } else if ((AMOUNT - oldValue) % 5 === 0) {
                                amount += 1;
                            }
                            newValue = oldValue - amount;
                            newTotal = oldTotal - amount;
                        }

                        if (isPendingEp) {
                            console.log(interaction)
                            interaction.user.send(`${sheetName} has ${isPendingEp} EP pending from tokens. Give them their EP now!!!!`)
                        }

                        googleSheets.spreadsheets.values.update({
                            spreadsheetId,
                            range:`Sheet1!D${rowNumber}:E${rowNumber}`,
                            valueInputOption:"RAW",
                            resource:{values:[[newValue.toString(), newTotal.toString()]]}
                        });
                    }
                }
                if (j[i] !== undefined && j[i] !== '' &&
                    k[i] !== undefined && k[i] !== '' &&
                    l[i] !== undefined && l[i] !== '') {

                        var sheetName = j[i].split("(")[0].replace(/\s+/g, "");

                    if (userArray.includes(sheetName)) {
                        const rowNumber = i + 1;

                        const oldValue = Number(k[i]);
                        var newValue = oldValue;
                        const oldTotal = Number(l[i]);
                        var newTotal = oldTotal;

                        var isPendingEp;
                        var amount = AMOUNT;

                        if (method === "1") {
                            if (AMOUNT >= 5) {
                                isPendingEp = Math.floor(AMOUNT / 5)
                                amount += isPendingEp;
                            } else if ((AMOUNT + oldValue) % 5 === 0) {
                                isPendingEp = 1;
                                amount += 1;
                            }
                            newValue = oldValue + amount;
                            newTotal = oldTotal + amount;
                        } else {
                            if (AMOUNT >= 5) {
                                amount += Math.floor(AMOUNT / 5);
                            } else if ((AMOUNT - oldValue) % 5 === 0) {
                                amount += 1;
                            }
                            newValue = oldValue - amount;
                            newTotal = oldTotal - amount;
                        }

                        if (isPendingEp) {
                            interaction.user.send(`${sheetName} has ${isPendingEp} EP pending from tokens. Give them their EP now!!!!`)
                        }

                        googleSheets.spreadsheets.values.update({
                            spreadsheetId,
                            range:`Sheet1!K${rowNumber}:L${rowNumber}`,
                            valueInputOption:"RAW",
                            resource:{values:[[newValue.toString(), newTotal.toString()]]}
                        })
                    }
                }
                
            }
    
            if (method === "1") {
                interaction.reply({content: `Added ${AMOUNT} tokens to ${users}`, flags: MessageFlags.Ephemeral});
            } else if (method === "2") {
                interaction.reply({content: `Removed ${AMOUNT} tokens to ${users}`, flags: MessageFlags.Ephemeral});
            }
        } catch (error) {
            console.warn("!!! err", error);
        }
        
    }
};