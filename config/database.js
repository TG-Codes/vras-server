const { Sequelize } = require('sequelize');

// Support both individual env vars and MYSQL_URL format
let sequelize;

if (process.env.MYSQL_URL) {
    // Use Railway's MYSQL_URL format
    sequelize = new Sequelize(process.env.MYSQL_URL);
} else {
    // Use individual environment variables
    sequelize = new Sequelize(
        process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'vras',
        process.env.DB_USERNAME || process.env.MYSQL_USER || 'root',
        process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
        {
            host: process.env.DB_HOST || process.env.MYSQL_HOST || '0.0.0.0',
            port: process.env.DB_PORT || process.env.MYSQL_PORT || 3306,
            dialect: process.env.DB_CONNECTION || 'mysql'
        }
    );
}

module.exports = {
    sequelize
};