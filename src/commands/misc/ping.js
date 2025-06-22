const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Pong!!!',
    devOnly: true,
    // testOnly: true,
    // barcOnly: true,
    // options: Object[],

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    }
};