const Sequelize = require('sequelize');

const sequelize = new Sequelize('accessgate', 'user', 'password', {
    dialect: 'sqlite',
    host: './database.db',
    logging: false
})


module.exports = sequelize;