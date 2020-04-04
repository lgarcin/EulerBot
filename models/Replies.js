module.exports = (sequelize, DataTypes) => {
	return sequelize.define('replies', {
		message_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		reply_to_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};
