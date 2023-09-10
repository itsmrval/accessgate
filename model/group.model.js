const { Model, DataTypes} = require('sequelize');
const sequelize = require('../services/database.service');

class Group extends Model {}

Group.init({
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
        required: true,
    }
}, {
    sequelize,
    modelName: 'group'
})

module.exports = Group;