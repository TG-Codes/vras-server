'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */

    await queryInterface.addColumn('users', 'refreshToken', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'token'
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     */

    await queryInterface.removeColumn('users', 'refreshToken');
  }
};
