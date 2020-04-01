const { Replies } = require('../dbObjects.js');
const { exec } = require('child_process');

module.exports = {
	name: 'python',

	description: 'Execute python message',

	execute(message, args) {
		exec(`python -c "${args}"`, async (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			const sent = await message.reply(
				`
\`\`\`python
${args}
\`\`\`
Stdout
\`\`\`python
${stdout}
\`\`\`
Stderr
\`\`\`python
${stderr}
\`\`\`
`,
			);
			Replies.upsert({ message_id: sent.id, reply_to_id: message.id });
		});
	},
};