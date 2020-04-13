const { Users } = require('../dbObjects');
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
		await replyWithReactionCollector(message, { files, reply: message.author });
	},
};
