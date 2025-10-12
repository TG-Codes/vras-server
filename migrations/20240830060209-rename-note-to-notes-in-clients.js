'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('clients', 'note', 'notes');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('clients', 'notes', 'note');
  }
};
