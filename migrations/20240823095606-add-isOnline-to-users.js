'use strict';

const { after } = require('underscore');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'isOnline' column to the 'users' table
    await queryInterface.addColumn('users', 'isOnline', {
      type: Sequelize.TINYINT, // Use TINYINT instead of INTEGER
      defaultValue: 0, // 0 for offline, 1 for online
      allowNull: true,
      after:'isPro'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'isOnline' column from the 'users' table if rolled back
    await queryInterface.removeColumn('users', 'isOnline');
  }
};
