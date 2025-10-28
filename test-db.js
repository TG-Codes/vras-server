#!/usr/bin/env node

// Test database connection
require('dotenv').config();

const { sequelize } = require('./config/database');

async function testConnection() {
    try {
        console.log('🔄 Testing database connection...');
        
        // Test the connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');
        
        // Test a simple query
        const [results] = await sequelize.query('SELECT 1 as test');
        console.log('✅ Database query successful:', results);
        
        console.log('🎉 All database tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testConnection();
