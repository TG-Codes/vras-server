const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Logo = sequelize.define('logos', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: 'public/uploads/logos/default.png',
        allowNull: true
    }
});

module.exports = {
    Logo
};