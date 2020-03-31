module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		katexOptions: {
			type: DataTypes.TEXT,
			defaultValue: '{}',
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};