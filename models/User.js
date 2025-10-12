const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const { Client } = require('./Client');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    clientId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.name} ${this.lastName}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        }
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: 'public/uploads/profile/avatar.png',
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'client', 'instructor', 'user'),
        defaultValue: 'user',
        allowNull: false
    },
    permissions: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true
    },
    resetCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetExpiries: {
        type: DataTypes.DATE,
        allowNull: true
    },
    code: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    countryCode: {
        type: DataTypes.STRING
    },
    mobile: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false
    },
    dateOfBirth: {
        // type: DataTypes.DATE,
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        defaultValue: 'male',
        allowNull: false
    },
    primaryHand: {
        type: DataTypes.ENUM('left', 'right'),
        defaultValue: 'left',
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emergencyContactName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emergencyContactPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    medicalConditions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    allergies: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    experienceLevel: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner',
        allowNull: false,
    },
    stressLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        defaultValue: 'low',
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'delete'),
        defaultValue: 'active',
        allowNull: false
    },
    isPro: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
    },
    isOnline: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: true,
    },
});

module.exports = {
    User
};