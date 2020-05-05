const axios = require('axios');
const { Users } = require('../dbObjects');

module.exports = {
	name: 'katex',

	description: 'Retrieve katex options from gist',

	async execute(message, args) {
		if (args === 'info') {
			try {
				const katexOptions = (await Users.findOne({ where: { user_id: message.author.id } })).katexOptions;
				message.reply(katexOptions);
			}
			catch { message.reply('No KaTeX options'); }
		}
		else {
			try {
				const {
					data: { files },
				} = await axios.get(
					`https://api.github.com/gists/${args}`,
				);
				const katexOptions = Object.assign(
					{},
					...Object.values(files).map(file => JSON.parse(file.content)),
				);
				await Users.upsert({ user_id: message.author.id, katexOptions: JSON.stringify(katexOptions) });
				message
					.reply('KaTeX Gist stored\n' + JSON.stringify(katexOptions))
					.then(msg => msg.delete({ timeout: 5000 }));
			}
			catch { message.reply('Wrong Gist id'); }
		}
	},
};
