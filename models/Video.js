const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Video = sequelize.define('videos', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        // unique: true,
        allowNull: false
    }
});

module.exports = {
    Video
};