const { Replies } = require('../dbObjects.js');
const { execSync } = require('child_process');
const { readdirSync } = require('fs');

module.exports = {
	name: 'python',

	description: 'Execute python message',

	async execute(message, args) {
		try {
			const code = `
import matplotlib.pyplot
import os

i=0

os.mkdir('/tmp/${message.id}')

def f():
	global i
	matplotlib.pyplot.savefig('/tmp/${message.id}/'+str(i)+'.png')
	matplotlib.pyplot.clf()
	i+=1

matplotlib.pyplot.show=f
${args}
`;
			const result = execSync('python -', { input: code }).toString();
			const sent = await message.reply(
				`
**Code**
\`\`\`python
${args}
\`\`\`
**Sortie**
\`\`\`python
${result}
\`\`\`
`, { files: readdirSync(`/tmp/${message.id}/`).map(file => `/tmp/${message.id}/${file}`) });
			Replies.upsert({ message_id: sent.id, reply_to_id: message.id });
		}
		catch (e) {
			message.reply(e.toString()).then(msg => msg.delete({ timeout: 10000 }));
		}
	}
	,
};
