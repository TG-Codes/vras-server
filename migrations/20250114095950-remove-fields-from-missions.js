
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('missions', 'location');
    await queryInterface.removeColumn('missions', 'difficulty')
    await queryInterface.removeColumn('missions', 'health')
    await queryInterface.removeColumn('missions', 'notes')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('missions', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('missions', 'difficulty', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('missions', 'health', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('missions', 'notes', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
