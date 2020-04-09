const { Replies } = require('../dbObjects');

module.exports = async (message, ...content) => {
	const sent = await message.channel.send(...content);
	await Replies.upsert({ message_id: sent.id, reply_to_id: message.id });
	await sent.react('🗑️');
	const reactionCollector = sent.createReactionCollector((reaction, user) => reaction.emoji.name === '🗑️' && user === message.member.user);
	reactionCollector.on('collect', async () => {
		await Replies.destroy({ where: { reply_to_id: message.id } });
		await message.delete();
		sent.reactions.cache.forEach(async reaction => {
			if (reaction.emoji.name === '🗑️') await reaction.remove();
		});
	});
};