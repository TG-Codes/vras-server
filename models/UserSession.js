const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserSession = sequelize.define('userSessions', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    sessionId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
});

module.exports = {
    UserSession
};