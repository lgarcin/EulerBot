const Sequelize = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('users', {
		user_id: {
			type: Sequelize.STRING,
			primaryKey: true,
		},
		katexOptions: {
			type: Sequelize.TEXT,
			defaultValue: '{}',
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};