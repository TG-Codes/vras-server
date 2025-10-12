'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert('departments', [
      // Metro Police Department Departments
      {
        clientId: 1,
        environmentId: 1, // Urban Warehouse
        name: 'SWAT Team',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 1,
        environmentId: 1,
        name: 'Patrol Division',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 1,
        environmentId: 1,
        name: 'Detective Bureau',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 1,
        environmentId: 1,
        name: 'Traffic Division',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Security Corp International Departments
      {
        clientId: 2,
        environmentId: 2, // Office Building
        name: 'Executive Protection',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 2,
        environmentId: 2,
        name: 'Corporate Security',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 2,
        environmentId: 2,
        name: 'Event Security',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 2,
        environmentId: 2,
        name: 'Training Division',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Mall Security Services Departments
      {
        clientId: 3,
        environmentId: 3, // Shopping Mall
        name: 'Retail Security',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 3,
        environmentId: 3,
        name: 'Loss Prevention',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 3,
        environmentId: 3,
        name: 'Crowd Control',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // University Campus Security Departments
      {
        clientId: 4,
        environmentId: 4, // School Campus
        name: 'Campus Patrol',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 4,
        environmentId: 4,
        name: 'Residence Hall Security',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 4,
        environmentId: 4,
        name: 'Event Security',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 4,
        environmentId: 4,
        name: 'Emergency Response',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Federal Agency Training Center Departments
      {
        clientId: 5,
        environmentId: 5, // Hospital Complex
        name: 'Special Operations',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 5,
        name: 'Intelligence Division',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 5,
        name: 'Counter-Terrorism',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 5,
        name: 'Cyber Security',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 5,
        name: 'Field Operations',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('departments', null, {});
  }
};
