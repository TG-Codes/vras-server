'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('clientScenarios', 'enviromentId', 'environmentId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('clientScenarios', 'environmentId', 'enviromentId');
  }
};
