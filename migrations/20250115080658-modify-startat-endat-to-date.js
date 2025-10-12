'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('missions', 'startAt', {
            type: Sequelize.DATE
        });
        await queryInterface.changeColumn('missions', 'endAt', {
            type: Sequelize.DATE
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('missions', 'startAt', {
            type: Sequelize.BIGINT
        });
        await queryInterface.changeColumn('missions', 'endAt', {
            type: Sequelize.BIGINT
        });
    }
};
