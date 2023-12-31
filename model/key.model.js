const { Model, DataTypes} = require('sequelize');
const sequelize = require('../services/database.service');

class Key extends Model {}

Key.init({
    idOwner: {
        type: DataTypes.INTEGER,
        required: true,
    },
    content: {
        type: DataTypes.STRING,
        required: true,
    },
    name: {
        type: DataTypes.STRING,
        required: true,
    },
}, {
    sequelize,
    modelName: 'key'
})

module.exports = Key;