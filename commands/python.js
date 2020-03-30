import { exec } from "child_process";

export const name = 'python';

export const description = 'Execute python message';

export function execute(message, args) {
    exec(`python -c "print(1+1)"`, (error, stdout, stderr) => {
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
`
        );
    });
}