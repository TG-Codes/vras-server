'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     */

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      clientId: {
        type: Sequelize.BIGINT,
        // references: {
        //   model: 'clients',
        //   key: 'id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'public/uploads/profile/avatar.png',
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM('admin', 'client', 'user'),
        defaultValue: 'user',
        allowNull: false,
      },
      permissions: {
        type: Sequelize.JSON,
        defaultValue: {},
        allowNull: true,
      },
      resetCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetExpiries: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      mobile: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        defaultValue: 'male',
        allowNull: false,
      },
      primaryHand: {
        type: Sequelize.ENUM('left', 'right'),
        defaultValue: 'left',
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
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
      emergencyContactName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emergencyContactPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      medicalConditions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      allergies: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      experienceLevel: {
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner',
        allowNull: false,
      },
      stressLevel: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'low',
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'delete'),
        defaultValue: 'active',
        allowNull: false,
      },
      isPro: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    await queryInterface.dropTable('users');
  }
};