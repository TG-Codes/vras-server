'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */
    await queryInterface.changeColumn('sessions', 'startAt', {
      type: Sequelize.DATE,
      allowNull: true, // removing not null constraint
    });

    await queryInterface.changeColumn('sessions', 'endAt', {
      type: Sequelize.DATE,
      allowNull: true, // removing not null constraint
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     */
    await queryInterface.changeColumn('sessions', 'startAt', {
      type: Sequelize.DATE,
      allowNull: false, // revert back to not null
    });

    await queryInterface.changeColumn('sessions', 'endAt', {
      type: Sequelize.DATE,
      allowNull: false, // revert back to not null
    });
  }
};
