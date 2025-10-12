'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */

    await queryInterface.addColumn('users', 'countryCode', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'email'
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     */
    
    await queryInterface.removeColumn('users', 'countryCode');
  }
};
