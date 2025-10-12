'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.addColumn('missions', 'environmentId', {
            type: Sequelize.BIGINT,
            // after:'clientId'
        });
        await queryInterface.addColumn('missions', 'scenarioId', {
            type: Sequelize.BIGINT,
            after: 'environmentId'
        });
        await queryInterface.addColumn('missions', 'departmentId', {
            type: Sequelize.BIGINT,
            after: 'environmentId'
        });
        await queryInterface.addColumn('missions', 'startAt', {
            type: Sequelize.BIGINT,
            after: 'description'
        });
        await queryInterface.addColumn('missions', 'endAt', {
            type: Sequelize.BIGINT,
            after: 'startAt'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('missions', 'environmentId');
        await queryInterface.removeColumn('missions', 'scenarioId');
        await queryInterface.removeColumn('missions', 'departmentId');
        await queryInterface.removeColumn('missions', 'startAt');
        await queryInterface.removeColumn('missions', 'endAt');
    }
};
