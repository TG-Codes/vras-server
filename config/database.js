const { Sequelize } = require('sequelize');
// Explicitly require mysql2 so Vercel bundles it and Sequelize can load the dialect
let mysql2Module;
try {
    mysql2Module = require('mysql2');
} catch (e) {
    mysql2Module = undefined;
}

// Support both individual env vars and MYSQL_URL format
let sequelize;

if (process.env.MYSQL_URL) {
    // Use Railway's MYSQL_URL format
    sequelize = new Sequelize(process.env.MYSQL_URL, { dialectModule: mysql2Module });
} else {
    // Use individual environment variables
    sequelize = new Sequelize(
        process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'vras',
        process.env.DB_USERNAME || process.env.MYSQL_USER || 'root',
        process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
        {
            host: process.env.DB_HOST || process.env.MYSQL_HOST || '0.0.0.0',
            port: process.env.DB_PORT || process.env.MYSQL_PORT || 3306,
            dialect: process.env.DB_CONNECTION || 'mysql',
            dialectModule: mysql2Module
        }
    );
}

module.exports = {
    sequelize
};