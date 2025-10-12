'use strict';

const { Role } = require('../models/Role');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [
      { name: 'client', description: 'Client Admin' },
      { name: 'instructor', description: 'Client Instructor' },
      { name: 'user', description: 'Client User' }
    ];

    await Role.bulkCreate(roles, {
      ignoreDuplicates: true,
      validate: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', {
      name: ['client', 'instructor', 'user']
    });
  }
};
