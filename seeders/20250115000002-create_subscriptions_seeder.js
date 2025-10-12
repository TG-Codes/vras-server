'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert('subscriptions', [
      {
        name: 'Basic Training',
        price: 99.00,
        description: 'Basic VR training package with limited scenarios and up to 10 users',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Professional Training',
        price: 299.00,
        description: 'Professional VR training package with advanced scenarios and up to 50 users',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Enterprise Training',
        price: 599.00,
        description: 'Enterprise VR training package with all scenarios and unlimited users',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Custom Training',
        price: 999.00,
        description: 'Custom VR training package with bespoke scenarios and dedicated support',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Trial Package',
        price: 49.00,
        description: '7-day trial package with basic scenarios and up to 5 users',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('subscriptions', null, {});
  }
};
