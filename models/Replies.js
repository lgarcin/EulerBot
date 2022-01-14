const Sequelize = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('replies', {
		message_id: {
			type: Sequelize.STRING,
			primaryKey: true,
		},
		reply_to_id: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};
