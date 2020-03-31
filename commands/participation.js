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

		const results = await Promise.allSettled(channels.map(channel => channel.messages.fetch({ limit: 100 })));
		const response = Array.from(results.filter(result => result.status === 'fulfilled')
			.flatMap(result => [...result.value.values()])
			.map(msg => msg.member)
			.filter(member => part.has(member))
			.reduce((acc, member) => acc.set(member, acc.get(member) + 1), part))
			.sort(([, n1], [, n2]) => n2 - n1)
			.map(([member, nb_messages]) => `<@${member.user.id}> ${nb_messages}`)
			.join('\n');

		message.reply(response);
	},
};