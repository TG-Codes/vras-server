const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blog = sequelize.define('blogs', {
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
        defaultValue: 'public/uploads/blogs/default.png',
        allowNull: true
    },
    categories: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tags: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = {
    Blog
};