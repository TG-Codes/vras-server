// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Environment } = require('../../models/Environment');
const { Scenario } = require('../../models/Scenario');

const index = async (req, res) => {
    try {
        const scenarios = await Scenario.findAll({
            include: [Environment],
            order: [
                ['id', 'DESC']
            ],
        });

        return response(res, { scenarios }, 'Scenarios list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index,
};