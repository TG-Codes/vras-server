'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert('environments', [
      {
        name: 'Urban Warehouse',
        description: 'Large urban warehouse environment with multiple floors and tactical scenarios',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Office Building',
        description: 'Multi-story office building with conference rooms and open spaces',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Shopping Mall',
        description: 'Large shopping center with multiple stores and corridors',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'School Campus',
        description: 'Educational facility with classrooms, hallways, and outdoor areas',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hospital Complex',
        description: 'Medical facility with patient rooms, operating theaters, and emergency areas',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Airport Terminal',
        description: 'Airport facility with check-in areas, security zones, and departure gates',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Subway Station',
        description: 'Underground transit station with platforms and tunnels',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Residential Complex',
        description: 'Apartment building with multiple floors and common areas',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('environments', null, {});
  }
};
