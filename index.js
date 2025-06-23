require('dotenv').config();
const { Client, IntentsBitField } = require("discord.js");
const { google } = require("googleapis");
const eventHandler = require('./src/handlers/eventHandler');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessageTyping,
    ]
});

const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
    keyFile: './db-credentials.json',
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

async function run () {
    const sheetsClient = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: sheetsClient});

    eventHandler(client, googleSheets);

    client.login(process.env.TOKEN);
}

run()