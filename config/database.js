const { Sequelize } = require('sequelize');

// Explicitly require mysql2 so Vercel bundles it and Sequelize can load the dialect
let mysql2Module;
try {
    mysql2Module = require('mysql2');
    console.log('✅ mysql2 module loaded successfully');
} catch (e) {
    console.error('❌ Failed to load mysql2 module:', e.message);
    mysql2Module = undefined;
}

// Support both individual env vars and MYSQL_URL format
let sequelize;

if (process.env.MYSQL_URL) {
    // Use MYSQL_URL format (Railway, PlanetScale, etc.)
    console.log('🔗 Using MYSQL_URL for database connection');
    sequelize = new Sequelize(process.env.MYSQL_URL, { 
        dialectModule: mysql2Module,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    });
} else {
    // Use individual environment variables
    console.log('🔗 Using individual environment variables for database connection');
    const config = {
        host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
        port: process.env.DB_PORT || process.env.MYSQL_PORT || 3306,
        dialect: 'mysql',
        dialectModule: mysql2Module,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    };

    // Add SSL configuration for production
    if (process.env.NODE_ENV === 'production') {
        config.dialectOptions = {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        };
    }

    sequelize = new Sequelize(
        process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'vras',
        process.env.DB_USERNAME || process.env.MYSQL_USER || 'root',
        process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
        config
    );
}

module.exports = {
    sequelize
};