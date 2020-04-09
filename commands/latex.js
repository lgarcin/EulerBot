const { Replies, Users } = require('../dbObjects');
const markdownToImg = require('../utils/mardown-to-png');
const replyWithReactionCollector = require('../utils/reply-with-reaction-collector');

module.exports = {
	name: 'latex',

	description: 'Render latex message',

	async execute(message) {

		if (message.member.user.bot) {
			return;
		}
		let katexOptions;
		try {
			katexOptions = JSON.parse((await Users.findOne({ where: { user_id: message.author.id } })).katexOptions);
		}
		catch {
			katexOptions = {};
		}
		const files = await markdownToImg(
			message.content,
			katexOptions,
			message.id,
		);
		await replyWithReactionCollector(message, files);
		// const sent = await message.channel.send(files);
		// await Replies.upsert({ message_id: sent.id, reply_to_id: message.id });
		// await sent.react('🗑️');
		// const reactionCollector = sent.createReactionCollector((reaction, user) => reaction.emoji.name === '🗑️' && user === message.member.user);
		// reactionCollector.on('collect', async () => {
		// 	await Replies.destroy({ where: { reply_to_id: message.id } });
		// 	await message.delete();
		// });
	},
};
