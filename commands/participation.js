module.exports = {
	name: 'participation',

	description: 'Participation',

	async execute(message) {
		const members = (await (message.mentions.members.size == 0
			? message.guild.members
			: message.mentions.members
		).fetch()).filter(member => !member.user.bot);
		console.log(message.mentions.channels);
		console.log(message.guild.channels.cache);
		const channels = (message.mentions.channels.size == 0
			? message.guild.channels.cache
			: message.mentions.channels
		).filter(channel => channel.type === 'text');

		const part = new Map(
			members.filter(member => !member.user.bot).map(member => [member, 0]),
		);

		Promise.all(
			channels.map(channel =>
				channel.fetchMessages({ limit: 100 }).catch(() => {
					return 'rejected';
				}),
			),
		).then(results => {
			results
				.filter(result => result !== 'rejected')
				.forEach(messages =>
					messages
						.filter(msg => part.has(msg.member))
						.forEach(msg =>
							part.set(msg.member, part.get(msg.member) + 1),
						),
				);
			const response = Array.from(part)
				.sort(([, n1], [, n2]) => n2 - n1)
				.map(([member, nb_messages]) => member + ' ' + nb_messages)
				.join('\n');
			message.reply(response);

		});
	},
};