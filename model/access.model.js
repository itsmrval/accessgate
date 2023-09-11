const { Model, DataTypes} = require('sequelize');
const sequelize = require('../services/database.service');

class Access extends Model {}

Access.init({
    serverHostname: {
        type: DataTypes.STRING,
        required: true,
    },
    groupName: {
        type: DataTypes.INTEGER,
        required: true,
    }
}, {
    sequelize,
    modelName: 'access'
})

module.exports = Access;