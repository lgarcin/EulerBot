const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

sequelize.import('models/Users');
sequelize.import('models/Replies');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force });
console.log('DB initialized');