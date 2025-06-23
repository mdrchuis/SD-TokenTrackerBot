const { ApplicationCommandOptionType, MessageFlags } = require('discord.js');

module.exports = {
    name: 'test',
    description: 'Pong!!!',
    devOnly: true,
    testOnly: true,
    //sheets: true,
    // barcOnly: true,
    // leadershipOnly: true,
    // options: Object[],

    callback: (client, interaction) => {
        interaction.reply({content: `Pong! ${client.ws.ping}ms`, flags: MessageFlags.Ephemeral});
    }
};