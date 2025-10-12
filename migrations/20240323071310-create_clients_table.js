'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */

    await queryInterface.createTable('clients', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      subscriptionId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      numberOfUsers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      numberOfProUsers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      environmentId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      slug: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false,
      },
      mobile: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      startAt: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      endAt: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      payStatus: {
        type: Sequelize.ENUM('paid', 'initiate', 'due'),
        defaultValue: 'due',
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'delete'),
        defaultValue: 'active',
        allowNull: true,
      },
      isOnline: {
        type: Sequelize.ENUM('online', 'offline'),
        defaultValue: 'offline',
        allowNull: true,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.dropTable('clients');
  }
};