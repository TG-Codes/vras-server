'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert('clientScenarios', [
      // Metro Police Department - Urban Warehouse Scenarios
      {
        clientId: 1,
        environmentId: 1,
        scenarioId: 1, // Warehouse Hostage Situation
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 1,
        environmentId: 1,
        scenarioId: 2, // Bomb Threat Response
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 1,
        environmentId: 1,
        scenarioId: 3, // Armed Robbery
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Security Corp International - Office Building Scenarios
      {
        clientId: 2,
        environmentId: 2,
        scenarioId: 4, // Active Shooter - Office Complex
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 2,
        environmentId: 2,
        scenarioId: 5, // Suspicious Package
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 2,
        environmentId: 2,
        scenarioId: 6, // Workplace Violence
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Mall Security Services - Shopping Mall Scenarios
      {
        clientId: 3,
        environmentId: 3,
        scenarioId: 7, // Mall Shooting Incident
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 3,
        environmentId: 3,
        scenarioId: 8, // Retail Theft with Weapon
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // University Campus Security - School Campus Scenarios
      {
        clientId: 4,
        environmentId: 4,
        scenarioId: 9, // School Shooting Response
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 4,
        environmentId: 4,
        scenarioId: 10, // Campus Intruder
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Federal Agency Training Center - Hospital Complex Scenarios
      {
        clientId: 5,
        environmentId: 5,
        scenarioId: 11, // Hospital Hostage Crisis
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 5,
        scenarioId: 12, // Emergency Room Violence
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Additional scenarios for comprehensive training
      // Metro Police also gets Office Building scenarios
      {
        clientId: 1,
        environmentId: 2,
        scenarioId: 4, // Active Shooter - Office Complex
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 1,
        environmentId: 2,
        scenarioId: 6, // Workplace Violence
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Security Corp also gets Mall scenarios
      {
        clientId: 2,
        environmentId: 3,
        scenarioId: 7, // Mall Shooting Incident
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 2,
        environmentId: 3,
        scenarioId: 8, // Retail Theft with Weapon
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // University also gets Hospital scenarios
      {
        clientId: 4,
        environmentId: 5,
        scenarioId: 11, // Hospital Hostage Crisis
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Federal Agency gets all scenarios for comprehensive training
      {
        clientId: 5,
        environmentId: 1,
        scenarioId: 1, // Warehouse Hostage Situation
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 1,
        scenarioId: 2, // Bomb Threat Response
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 2,
        scenarioId: 4, // Active Shooter - Office Complex
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 2,
        scenarioId: 5, // Suspicious Package
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 3,
        scenarioId: 7, // Mall Shooting Incident
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 4,
        scenarioId: 9, // School Shooting Response
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 6,
        scenarioId: 13, // Airport Security Breach
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 6,
        scenarioId: 14, // Suspicious Passenger
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 7,
        scenarioId: 15, // Transit Station Attack
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 8,
        scenarioId: 17, // Domestic Violence Call
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        environmentId: 8,
        scenarioId: 18, // Home Invasion Response
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('clientScenarios', null, {});
  }
};
