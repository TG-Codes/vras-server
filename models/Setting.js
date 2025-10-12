const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Setting = sequelize.define('settings', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    key: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = {
    Setting
};