import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {token, clientId, guildId} from './config.json';
import fs from 'fs';

const commands = [];
const commandFiles = fs.readdirSync(`${__dirname}/commands`)
    .filter((file: string) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`${__dirname}/commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({version: '9'}).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {body: commands},
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
