const { execSync } = require('child_process');

module.exports = {
	name: 'test',
	description: 'Test',
	async execute(message, args) {
		const result = execSync(args).toString();
		message.reply(result);
	},
};