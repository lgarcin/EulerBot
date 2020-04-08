const md = require('markdown-it')(),
	mk = require('markdown-it-katexx'),
	puppeteer = require('puppeteer'),
	{ readFileSync } = require('fs'),
	jsdom = require('jsdom'),
	{ Replies, Users } = require('../dbObjects.js');


module.exports = {
	name: 'latex',

	description: 'Render latex message',

	async execute(message) {

		const md2img = async (text, katexOptions, name) => {
			const dom = new jsdom.JSDOM(readFileSync('assets/template_katex.html', 'utf8'));
			md.use(mk, katexOptions);
			const regex = /\\begin{picture}.*?\\end{picture}|\\begin{tikzpicture}.*?\\end{tikzpicture}|\\usetikzlibrary{.*?}\s*\\begin{tikzpicture}.*?\\end{tikzpicture}|\\xymatrix{(?:[^)(]+|{(?:[^)(]+|{[^)(]*})*})*}/gms;
			let result = text.replace(
				regex,
				match =>
					`![](https://i.upmath.me/svg/${escape(
						match
							.replace(/à/g, '\\`a')
							.replace(/â/g, '\\^a')
							.replace(/é/g, '\\\'e')
							.replace(/è/g, '\\`e')
							.replace(/ê/g, '\\^e')
							.replace(/î/g, '\\^i')
							.replace(/ô/g, '\\^o')
							.replace(/ù/g, '\\`u')
							.replace(/û/g, '\\^u'),
					)})`,
			);
			result = md.render(result);
			dom.window.document.querySelector('body').innerHTML = result;
			const browser = await puppeteer.launch({
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
			});
			const page = await browser.newPage();
			await page.setViewport({
				width: 1920,
				height: 1080,
				deviceScaleFactor: 3,
			});
			await page.setContent(dom.serialize());
			const content = await page.$('body');
			const fileName = `/tmp/${name}.png`;
			await content.screenshot({
				path: fileName,
			});
			await browser.close();
			return {
				files: [fileName],
			};
		};

		if (message.member.user.bot) {
			return;
		}
		let katexOptions;
		try {
			katexOptions = JSON.parse((await Users.findOne({ where: { user_id: message.author.id } })).katexOptions);
		}
		catch {
			katexOptions = {};
		}
		const files = await md2img(
			message.content,
			katexOptions,
			message.id,
		);
		const sent = await message.channel.send(files);
		Replies.upsert({ message_id: sent.id, reply_to_id: message.id });
	},
};
