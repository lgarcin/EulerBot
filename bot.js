const { readdirSync } = require('fs');
const Discord = require('discord.js');
const { Replies } = require('./dbObjects');

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

const replyTo = async message => {
	if (message.author.bot) return;

	let commandName;
	let args;
	let match;
	match = message.content.match(/^!python[\r\n\s]+(.*?)$/s);
	if (match) {
		commandName = 'python';
		args = match[1];
	}
	match = message.content.match(/^!test[\r\n\s]+(.*?)$/s);
	if (match) {
		commandName = 'test';
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
		args = match[1];
	}
	match = message.content.match(/^!participation$/);
	if (match) {
		commandName = 'participation';
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
};

const deleteReplies = async message => {
	await Replies.findAll({ where: { reply_to_id: message.id } })
		.then(replies => replies.forEach(reply => {
			message.channel.messages.fetch(reply.message_id).then(msg => msg.delete());
		}));
	Replies.destroy({ where: { reply_to_id: message.id } });
	Replies.destroy({ where: { message_id: message.id } });
};

client.on('message', async message => replyTo(message));

client.on('messageDelete', async message => {
	deleteReplies(message);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
	replyTo(newMessage);
	deleteReplies(newMessage);
});

client.login(process.env.BOT_TOKEN);
