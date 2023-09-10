const { Model, DataTypes} = require('sequelize');
const sequelize = require('../services/database.service');

class Member extends Model {}

Member.init({
    groupName: {
        type: DataTypes.STRING,
        required: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        required: true,
    },
    role: {
        type: DataTypes.STRING,
        required: true,
        defaultValue: 'member'
    }
}, {
    sequelize,
    modelName: 'member'
})

module.exports = Member;