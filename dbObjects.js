const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL,
    process.env.NODE_ENV === 'production' ?
        {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        } : {}
);

const Users = require('./models/Users.js')(sequelize,);
const Replies = require('./models/Replies.js')(sequelize);

module.exports = { Users, Replies };