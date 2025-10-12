'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert('scenarios', [
      // Urban Warehouse Scenarios
      {
        environmentId: 1,
        name: 'Warehouse Hostage Situation',
        description: 'Active shooter scenario in a warehouse with multiple hostages. Practice hostage rescue tactics.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 1,
        name: 'Bomb Threat Response',
        description: 'Respond to bomb threat in warehouse loading dock. Practice evacuation and search procedures.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 1,
        name: 'Armed Robbery',
        description: 'Armed robbery in progress at warehouse office. Practice de-escalation and apprehension.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Office Building Scenarios
      {
        environmentId: 2,
        name: 'Active Shooter - Office Complex',
        description: 'Active shooter situation in multi-story office building. Practice room clearing and evacuation.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 2,
        name: 'Suspicious Package',
        description: 'Suspicious package found in office lobby. Practice threat assessment and response.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 2,
        name: 'Workplace Violence',
        description: 'Domestic dispute escalates to violence in office setting. Practice intervention tactics.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Shopping Mall Scenarios
      {
        environmentId: 3,
        name: 'Mall Shooting Incident',
        description: 'Active shooter in crowded shopping mall. Practice crowd control and threat neutralization.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 3,
        name: 'Retail Theft with Weapon',
        description: 'Armed shoplifting incident escalates to violence. Practice apprehension and de-escalation.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // School Campus Scenarios
      {
        environmentId: 4,
        name: 'School Shooting Response',
        description: 'Active shooter on school campus. Practice rapid response and student evacuation.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 4,
        name: 'Campus Intruder',
        description: 'Unauthorized individual on school grounds with weapon. Practice perimeter security.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Hospital Complex Scenarios
      {
        environmentId: 5,
        name: 'Hospital Hostage Crisis',
        description: 'Patient takes hostages in hospital ward. Practice medical facility security protocols.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 5,
        name: 'Emergency Room Violence',
        description: 'Violent patient threatens medical staff. Practice hospital security response.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Airport Terminal Scenarios
      {
        environmentId: 6,
        name: 'Airport Security Breach',
        description: 'Security breach at airport terminal. Practice aviation security protocols.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 6,
        name: 'Suspicious Passenger',
        description: 'Suspicious behavior in departure area. Practice passenger screening and response.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Subway Station Scenarios
      {
        environmentId: 7,
        name: 'Transit Station Attack',
        description: 'Coordinated attack on subway station. Practice transit security response.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 7,
        name: 'Underground Pursuit',
        description: 'Suspect fleeing through subway tunnels. Practice underground pursuit tactics.',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Residential Complex Scenarios
      {
        environmentId: 8,
        name: 'Domestic Violence Call',
        description: 'Domestic violence situation in apartment building. Practice conflict resolution.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        environmentId: 8,
        name: 'Home Invasion Response',
        description: 'Home invasion in progress. Practice residential security tactics.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('scenarios', null, {});
  }
};
