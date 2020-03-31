const { readdirSync } = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
	console.log('I am ready!');
});

client.on('message', async message => {
	if (message.author.bot) return;

	let commandName;
	let args;
	let match;
	match = message.content.match(/^!python[\r\n\s]+(.*?)$/s);
	if (match) {
		commandName = 'python';
		args = match[1];
	}
	match = message.content.match(/\$.*\$|\\begin|\\xymatrix/gm);
	if (match) {
		commandName = 'latex';
		args = message.content;
	}
	match = message.content.match(/^!katex (.*?)$/);
	if (match) {
		commandName = 'katex';
		args = message.match[1];
	}


	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.BOT_TOKEN);
