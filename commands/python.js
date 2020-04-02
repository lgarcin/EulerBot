const { Replies } = require('../dbObjects.js');
const { exec } = require('child_process');

module.exports = {
	name: 'python',

	description: 'Execute python message',

	execute(message, args) {
		exec(`python -c "${args}"`, async (error, stdout) => {
			if (error) {
				console.error(`exec error: ${error}`);
				message.channel.send(`${error}`).then(msg => msg.delete({ timeout: 10000 }));
				return;
			}
			const sent = await message.reply(
				`
**Code**
\`\`\`python
${args}
\`\`\`
**Sortie**
\`\`\`python
${stdout}
\`\`\`
`,
			);
			Replies.upsert({ message_id: sent.id, reply_to_id: message.id });
		});
	},
};