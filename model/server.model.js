const { Model, DataTypes} = require('sequelize');
const sequelize = require('../services/database.service');

class Server extends Model {}

Server.init({
    hostname: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        primaryKey: true,
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
    },
    secret: {
        type: DataTypes.STRING,
        required: true,
    },
    tmp: {
        type: DataTypes.STRING,
        required: true,
    }
}, {
    sequelize,
    modelName: 'server'
})

module.exports = Server;