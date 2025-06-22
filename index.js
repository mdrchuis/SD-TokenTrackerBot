require('dotenv').config();
const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require('./src/handlers/eventHandler');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessageTyping,
    ]
});

eventHandler(client);

client.login(process.env.TOKEN);