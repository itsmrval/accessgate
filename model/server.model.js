const { Model, DataTypes} = require('sequelize');
const sequelize = require('../services/database.service');

class Server extends Model {}

Server.init({
    hostname: {
        type: DataTypes.STRING,
        required: true,
    },
    ip: {
        type: DataTypes.STRING,
        required: true,
    },
    username: {
        type: DataTypes.STRING,
        required: true,
    },
    lastPull: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'server'
})

module.exports = Server;