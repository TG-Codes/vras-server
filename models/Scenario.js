const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const { Client } = require('./Client');
const { Session } = require('./Session');
const { Environment } = require('./Environment');

const Scenario = sequelize.define('scenarios', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    environmentId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

// Scenario.belongsTo(Client, {
//     foreignKey: 'clientId',
//     targetKey: 'id',
//     onUpdate: 'CASCADE', // 'NO ACTION',
//     onDelete: 'SET NULL' // 'RESTRICT'
// });
// const users = await Scenario.findAll({
//     include: ['Client'], // Include the associated Client model
// });

// Client.hasMany(Scenario, {
//     foreignKey: 'clientId',
//     targetKey: 'id',
//     onUpdate: 'CASCADE', // 'NO ACTION',
//     onDelete: 'SET NULL' // 'RESTRICT'
// });
// const clients = await Client.findAll({
//     include: ['Scenario'], // Include the associated Scenario model
// });

// Scenario.belongsTo(Session, {
//     foreignKey: 'sessionId',
//     targetKey: 'id',
//     onUpdate: 'CASCADE', // 'NO ACTION',
//     onDelete: 'SET NULL' // 'RESTRICT'
// });
// const scenarios = await Scenario.findAll({
//     include: ['Session'], // Include the associated Session model
// });

// Session.hasMany(Scenario, {
//     foreignKey: 'sessionId',
//     targetKey: 'id',
//     onUpdate: 'CASCADE', // 'NO ACTION',
//     onDelete: 'SET NULL' // 'RESTRICT'
// });
// const sessions = await Session.findAll({
//     include: ['Scenario'], // Include the associated Scenario model
// });

// Scenario.belongsTo(Environment, {
//     foreignKey: 'environmentId',
//     targetKey: 'id',
//     onUpdate: 'CASCADE',
//     onDelete: 'SET NULL'
// });

// Environment.hasMany(Scenario, {
//     foreignKey: 'environmentId',
//     sourceKey: 'id',
//     onUpdate: 'CASCADE',
//     onDelete: 'SET NULL'
// });

module.exports = {
    Scenario
};