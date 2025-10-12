'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('missions', 'status', {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
      after:'notes'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('missions', 'status');
  }
};
