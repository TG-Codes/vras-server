const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const UserMission = sequelize.define('userMissions', {
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
    userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    missionId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    assaultTime: {
        type: DataTypes.TIME,
    },
    mode: {
        type: DataTypes.STRING,
    },
    totalTerrorist: {
        type: DataTypes.INTEGER,
    },
    bulletsFired: {
        type: DataTypes.INTEGER,
    },
    bulletsOnTerrorist: {
        type: DataTypes.INTEGER,
    },
    bulletsOnCrowd: {
        type: DataTypes.INTEGER,
    },
    accuracy: {
        type: Sequelize.FLOAT,
    },
    casualities: {
        type: Sequelize.INTEGER,
    },
    survived: {
        type: Sequelize.INTEGER,
    },
    confirmedKills: {
        type: Sequelize.INTEGER,
    },
    playersDamage: {
        type: Sequelize.FLOAT,
    },
    responseTime: {
        type: Sequelize.TIME,
    },
    feedback: {
        type: Sequelize.TEXT
    },
    status: {
        type: Sequelize.ENUM('active', 'inactive')
    },
});

module.exports = {
    UserMission
};