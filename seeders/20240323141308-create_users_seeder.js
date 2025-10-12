'use strict';

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert('users', [{
      name: 'Admin',
      role: 'admin',
      mobile: '9876543210',
      countryCode: '+1',
      email: 'admin@example.com',
      username: 'admin',
      password: bcrypt.hashSync('Admin#123', salt),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('users', null, {});
  }
};