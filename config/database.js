const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DATABASE || 'vras',
    process.env.DB_USERNAME || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || '0.0.0.0',
        dialect: process.env.DB_CONNECTION || 'mysql'
    }
);

module.exports = {
    sequelize
};