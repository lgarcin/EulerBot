const Discord = require('discord.js');
const client = new Discord.Client();
const { exec } = require("child_process");

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', async message => {
    if (message.content === 'ping') {
        // message.reply('pong');
        exec(`python -c "print(1+1)"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            message.reply(
                `
\`\`\`python
print(1+1)
\`\`\`
Stdout
\`\`\`python
${stdout}
\`\`\`
            `
            );
        });

    }
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
