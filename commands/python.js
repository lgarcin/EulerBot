const { Replies } = require('../dbObjects.js');
const { execSync } = require('child_process');
const { readdirSync } = require('fs');
const replyWithReactionCollector = require('../utils/reply-with-reaction-collector');

module.exports = {
	name: 'python',

	description: 'Execute python message',

	async execute(message, args) {
		try {
			const code = `
import matplotlib.pyplot
import os

i=0

os.makedirs('/tmp/${message.id}', exist_ok=True)

def f():
	global i
	filename = '/tmp/${message.id}/'+str(i)+'.png'
	matplotlib.pyplot.savefig(filename)
	matplotlib.pyplot.clf()
	i+=1

matplotlib.pyplot.show = f
${args}
`;
			const result = execSync('python -', { input: code }).toString();
			const content = `
**Code**
\`\`\`python
${args}
\`\`\`
**Sortie**
\`\`\`python
${result}
\`\`\`
			`;
			const files = { files: readdirSync(`/tmp/${message.id}/`).map(file => `/tmp/${message.id}/${file}`) };
			replyWithReactionCollector(message, content, files);

			// 			const sent = await message.channel.send(
			// 				`
			// **Code**
			// \`\`\`python
			// ${args}
			// \`\`\`
			// **Sortie**
			// \`\`\`python
			// ${result}
			// \`\`\`
			// `, { files: readdirSync(`/tmp/${message.id}/`).map(file => `/tmp/${message.id}/${file}`) });
			// 			Replies.upsert({ message_id: sent.id, reply_to_id: message.id });
		}
		catch (e) {
			message.reply(e.toString()).then(msg => msg.delete({ timeout: 10000 }));
		}
	}
	,
};
