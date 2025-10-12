const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cms = sequelize.define('cms', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: 'public/uploads/cms/default.png',
        allowNull: true
    },
    en: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    he: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = {
    Cms
};