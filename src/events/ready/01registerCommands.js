require('dotenv').config();
const { REST, Routes } = require('discord.js');
const path = require('path');
const getAllCommands = require(path.join(__dirname, '..', '..', 'utils', 'getAllCommands.js'));

module.exports = async () => {
    try {
        const commands = getAllCommands()

        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`registerCommands.js > Loaded Commands`)
    } catch (error) {
        console.error(`registerCommands.js ! Catched Error: ${error}`)
    }
};