const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);
(async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
})();
sequelize.import('models/Users');
sequelize.import('models/Replies');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force });
console.log('DB initialized');