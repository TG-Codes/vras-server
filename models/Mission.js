const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mission = sequelize.define('missions', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    clientId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    environmentId: {
        type: DataTypes.BIGINT,
    },
    scenarioId: {
        type: DataTypes.BIGINT,
    },
    departmentId: {
        type: DataTypes.BIGINT,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    startAt: {
        type: DataTypes.DATE
    },
    endAt: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false,
    },
});

module.exports = {
    Mission
};