'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('clients', 'countryCode', {
      type: Sequelize.STRING(5),
      allowNull: true,
      after: 'email'
    });

    await queryInterface.addColumn('clients', 'contactName', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'mobile'
    });

    await queryInterface.addColumn('clients', 'contactEmail', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'contactName'
    });

    await queryInterface.addColumn('clients', 'contactCountryCode', {
      type: Sequelize.STRING(5),
      allowNull: true,
      after:'contactEmail'
    });

    await queryInterface.addColumn('clients', 'contactMobile', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'contactCountryCode'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('clients', 'contactName');
    await queryInterface.removeColumn('clients', 'countryCode');
    await queryInterface.removeColumn('clients', 'contactEmail');
    await queryInterface.removeColumn('clients', 'contactCountryCode');
    await queryInterface.removeColumn('clients', 'contactMobile');
  }
};

