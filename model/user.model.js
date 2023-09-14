const { Model, DataTypes} = require('sequelize');
const sequelize = require('../services/database.service');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        required: true,
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        required: true,
    },
    login: {
        type: DataTypes.STRING,
        required: true,
    },
    avatar: {
        type: DataTypes.STRING,
        required: true,
    },
    displayName: {
        type: DataTypes.STRING,
        required: true,
    },
    serverUsername : {
        type: DataTypes.STRING,
        required: true,
    }
}, {
    sequelize,
    modelName: 'user'
})

module.exports = User;