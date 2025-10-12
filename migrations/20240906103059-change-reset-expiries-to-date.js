'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */
    await queryInterface.changeColumn('users', 'resetExpiries', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     */
    await queryInterface.changeColumn('users', 'resetExpiries', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
