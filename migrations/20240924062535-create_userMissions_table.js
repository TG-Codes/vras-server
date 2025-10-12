'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */

    await queryInterface.createTable('userMissions', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      clientId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      environmentId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      missionId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      assaultTime: {
        type: Sequelize.TIME
      },
      mode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      totalTerrorist: {
        type: Sequelize.INTEGER,
      },
      bulletsFired: {
        type: Sequelize.INTEGER,
      },
      bulletsOnTerrorist: {
        type: Sequelize.INTEGER,
      },
      bulletsOnCrowd: {
        type: Sequelize.INTEGER,
      },
      accuracy: {
        type: Sequelize.FLOAT,
      },
      casualities: {
        type: Sequelize.INTEGER,
      },
      survived: {
        type: Sequelize.INTEGER,
      },
      confirmedKills: {
        type: Sequelize.INTEGER,
      },
      playersDamage: {
        type: Sequelize.FLOAT,
      },
      responseTime: {
        type: Sequelize.TIME,
      },
      feedback: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive')
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     */

    await queryInterface.dropTable('userMissions');
  }
};