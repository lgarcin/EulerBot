const fs = require('fs');
import { Client } from 'discord.js';

const client = new Client();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', async message => {
    if (message.author.bot) return;

    const match = message.content.match(/^!python[\r\n\s]+(.*?)$/s);
    if (match) {
        const command = 'python';
        const args = match[1];
    }

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
