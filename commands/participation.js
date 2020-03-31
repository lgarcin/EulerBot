module.exports = {
	name: 'participation',

	description: 'Participation',

	async execute(message) {
		const members = (await (message.mentions.members.size == 0
			? message.guild.members
			: message.mentions.members
		).fetch()).filter(member => !member.user.bot);
		const channels = (message.mentions.channels.size == 0
			? message.guild.channels.cache
			: message.mentions.channels
		).filter(channel => channel.type === 'text');

		const part = new Map(
			members.filter(member => !member.user.bot).map(member => [member, 0]),
		);

		const results = await Promise.allSettled(channels.map(channel => channel.messages.fetch()));

		console.log(results.filter(result => result.status === 'fulfilled')
			.flatMap(result => result.value).map(msg => msg.member));

		const response = Array.from(results.filter(result => result.status === 'fulfilled')
			.flatMap(result => result.value)
			.filter(msg => part.has(msg.member))
			.reduce((acc, msg) => acc.set(msg.member, acc.get(msg.member) + 1), part))
			.sort(([, n1], [, n2]) => n2 - n1)
			.map(([member, nb_messages]) => member.user.username + ' ' + nb_messages)
			.join('\n');

		// const response = Array.from(
		// 	channels
		// 		.flatMap(channel => channel.messages.cache)
		// 		// .flatMap(async channel => await channel.messages.fetch({ limit: 10 }))
		// 		.filter(msg => part.has(msg.member))
		// 		.reduce((acc, msg) => acc.set(msg.member, acc.get(msg.member) + 1), part))
		// 	.sort(([, n1], [, n2]) => n2 - n1)
		// 	.map(([member, nb_messages]) => member.user.username + ' ' + nb_messages)
		// 	.join('\n');

		message.reply(response);
	},
};