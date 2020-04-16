const md = require('markdown-it')();
const mk = require('markdown-it-katexx');
const puppeteer = require('puppeteer');
const { readFileSync } = require('fs');
const jsdom = require('jsdom');

module.exports = async (text, katexOptions, name) => {
	md.use(mk, katexOptions);

	const dom = new jsdom.JSDOM(readFileSync('assets/template_katex.html', 'utf8'));

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

	await page.goto(`data:text/html;charset=UTF-8,${encodeURIComponent(dom.serialize())}`, { waitUntil: 'networkidle0' });

	// await page.setContent(dom.serialize());
	const content = await page.$('body');
	const fileName = `/tmp/${name}.png`;
	await content.screenshot({
		path: fileName,
	});
	await browser.close();
	return [fileName];
};

