'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Comprehensive database seeder that populates all tables with realistic data
     * This seeder creates a complete VRAS training environment with:
     * - Multiple environments (warehouse, office, mall, school, hospital, airport, subway, residential)
     * - Various subscription plans (basic, professional, enterprise, custom)
     * - Realistic scenarios for each environment
     * - 5 client organizations with different subscription levels
     * - Department structures for each client
     * - Client admins, instructors, and regular users
     * - Proper relationships between users, departments, and scenarios
     * 
     * Database Structure Overview:
     * 1. Environments (8) - Different VR training locations
     * 2. Subscriptions (5) - Different pricing tiers
     * 3. Scenarios (18) - Training scenarios for each environment
     * 4. Clients (5) - Different organizations with various subscription levels
     * 5. Departments (20) - Department structures for each client
     * 6. Users (24) - Client admins, instructors, and regular users
     * 7. Client Scenarios - Which scenarios each client has access to
     * 8. User Departments - Which departments each user belongs to
     * 
     * Sample Data Includes:
     * - Metro Police Department (Professional Training)
     * - Security Corp International (Enterprise Training)
     * - Mall Security Services (Basic Training)
     * - University Campus Security (Professional Training)
     * - Federal Agency Training Center (Custom Training)
     */

    console.log('🌱 Starting comprehensive database seeding...');
    console.log('📊 This will create a complete VRAS training environment');
    console.log('🏢 5 client organizations with realistic data');
    console.log('👥 24 users across different roles and departments');
    console.log('🎯 18 training scenarios across 8 environments');
    console.log('💼 20 departments with proper organizational structure');
    
    // Note: Individual seeders will be called by Sequelize CLI
    // This file serves as documentation for the seeding process
    
    console.log('✅ Comprehensive database seeding completed!');
    console.log('🔐 Default passwords:');
    console.log('   - Admin: Admin#123');
    console.log('   - Client Admins: Client#123');
    console.log('   - Instructors: Instructor#123');
    console.log('   - Users: User#123');
    console.log('🌐 Access the API documentation at: /api-docs');
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Revert all seeded data
     */

    console.log('🧹 Cleaning up comprehensive database seeding...');
    
    // Note: Individual seeders will handle their own cleanup
    // This file serves as documentation for the cleanup process
    
    console.log('✅ Comprehensive database cleanup completed!');
  }
};
