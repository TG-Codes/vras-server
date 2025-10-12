'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */
    await queryInterface.changeColumn('clients', 'isOnline', {
      type: Sequelize.TINYINT, // Use TINYINT instead of INTEGER
      defaultValue: 0, // 0 for offline, 1 for online
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     */
    await queryInterface.changeColumn('clients', 'isOnline', {
      type: Sequelize.ENUM('online', 'offline'),
      defaultValue: 'offline',
      allowNull: true,
    });
  }
};
