const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = sequelize.import('models/Users');
const Replies = sequelize.import('models/Replies');

Users.prototype.setKatexOptions = (user_id, katexOptions) => {
	Users.upsert({ user_id, katexOptions });
};

Replies.prototype.getReplies = reply_to_id => {
	return Replies.findAll({
		where: { reply_to_id },
	});
};

module.exports = { Users, Replies };