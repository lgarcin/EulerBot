const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL,
    {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

const Users = sequelize.import('models/Users');
const Replies = sequelize.import('models/Replies');

module.exports = { Users, Replies };