'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */

    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      clientId: {
        type: Sequelize.BIGINT,
        // references: {
        //     model: 'Client', // name of the target model
        //     key: 'id', // name of the target column
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
        allowNull: true,
      },
      userId: {
        type: Sequelize.BIGINT,
        // references: {
        //     model: 'User', // name of the target model
        //     key: 'id', // name of the target column
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
        allowNull: true,
      },
      scenarioId: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sessionRecording: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false,
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

    await queryInterface.dropTable('sessions');
  }
};