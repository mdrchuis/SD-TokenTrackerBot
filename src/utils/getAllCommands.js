const path = require('path');
const getAllFiles = require(path.join(__dirname, '..', 'utils', 'getAllFiles.js'));

module.exports = (exceptions = []) => {
    const commands = [];

    const commandCategories = getAllFiles(
        path.join(__dirname, '..', 'commands'), 
        true
    );

    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory);

        for (const commandFile of commandFiles) {
            const commandObject = require(commandFile);
            if (exceptions.includes(commandObject.commandName)) { 
                continue;
            }
            commands.push(commandObject);
        }
    }

    return commands;
};