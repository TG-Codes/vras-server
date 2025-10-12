const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const { Client } = require('./Client');
const { User } = require('./User');

const Session = sequelize.define('sessions', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    clientId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    scenarioId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startAt: {
        type: DataTypes.DATE
    },
    endAt: {
        type: DataTypes.DATE
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sessionRecording: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false
    }
});

module.exports = {
    Session
};