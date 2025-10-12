const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserDepartment = sequelize.define('userDepartments', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    departmentId: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
});

module.exports = {
    UserDepartment
};