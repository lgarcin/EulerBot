const { Replies } = require('../dbObjects');
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = async (message, ...content) => {
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('deletable')
				.setLabel('🗑️')
				.setStyle('DANGER')
		);
	console.log({ ...content[0], components: [row] });
	const sent = await message.channel.send({ ...content[0], components: [row] });
	await Replies.upsert({ message_id: sent.id, reply_to_id: message.id });

	const filter = interaction => {
		interaction.deferUpdate();
		return interaction.user === message.member.user;
	};
	sent.awaitMessageComponent({ filter, componentType: 'BUTTON' })
		.then(async interaction => {
			await interaction.message.edit({ components: [] });
			await Replies.destroy({ where: { reply_to_id: message.id } });
			await message.delete();
		});
};