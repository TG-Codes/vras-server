'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */

    // Rename the column from 'enviromentId' to 'environmentId'
    await queryInterface.renameColumn('departments', 'enviromentId', 'environmentId');
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     */

    // Rename the column back from 'environmentId' to 'enviromentId'
    await queryInterface.renameColumn('departments', 'environmentId', 'enviromentId');
  }
};
