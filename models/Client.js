const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const { Subscription } = require('./Subscription');
const { Department } = require('./Department');
const { Environment } = require('./Environment');
const { ClientScenario } = require('./ClientScenario');

const Client = sequelize.define('clients', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    subscriptionId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    numberOfUsers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    numberOfProUsers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    environmentId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    countryCode: {
        type: DataTypes.STRING,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactName: {
        type: DataTypes.STRING,
    },
    contactEmail: {
        type: DataTypes.STRING
    },
    contactCountryCode: {
        type: DataTypes.STRING
    },
    contactMobile: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    startAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    endAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    payStatus: {
        type: DataTypes.ENUM('paid', 'initiate', 'due'),
        defaultValue: 'due',
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'delete'),
        defaultValue: 'active',
        allowNull: true
    },
    isOnline: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

module.exports = {
    Client
};