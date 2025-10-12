'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */

    await queryInterface.createTable('weapons', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false,
      },
      generation: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      accuracy: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      reloadTime: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      damage: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      fireRate: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      recoil: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      magazineCapacity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      bulletType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bulletCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      grenadeType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      grenadeCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      length: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      height: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      width: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: true,
      },
      manufacturer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      countryOfOrigin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      yearOfManufacture: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      notes: {
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

    await queryInterface.dropTable('weapons');
  }
};