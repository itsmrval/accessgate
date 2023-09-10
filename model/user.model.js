const { Model, DataTypes} = require('sequelize');
const sequelize = require('../services/database.service');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    login: {
        type: DataTypes.STRING,
    },
    avatar: {
        type: DataTypes.STRING,
    },
    displayName: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: 'user'
})

module.exports = User;