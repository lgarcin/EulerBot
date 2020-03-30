const { exec } = require('child_process');

module.exports = {
	name: 'python',

	description: 'Execute python message',

	execute(message, args) {
		exec(`python -c "${args}"`, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			message.reply(
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
		});
	},
};