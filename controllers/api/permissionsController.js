// Common Response
const { response } = require('../../config/response');

// Model
const { Op } = require('sequelize');
const { Permission } = require('../../models/Permission');

const index = async (req, res) => {
    try {
        const permissions = await Permission.findAll({
            order: [
                ['name', 'ASC']
            ]
        });

        return response(res, permissions, 'Permissions list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index
};