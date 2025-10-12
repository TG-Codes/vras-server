const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ClientScenario = sequelize.define('clientScenarios', {
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
        allowNull: true,
    },
    scenarioId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    }
});

module.exports = {
    ClientScenario
};