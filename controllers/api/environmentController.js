// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Environment } = require('../../models/Environment');

const index = async (req, res) => {
    try {
        const environments = await Environment.findAll({
            order: [
                ['id', 'DESC']
            ]
        });

        return response(res, { environments }, 'Environments list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index
};