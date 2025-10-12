// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Permission } = require('../../../models/Permission');
const { Role } = require('../../../models/Role');

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: roles } = await Role.findAndCountAll({
            order: [
                ['id', 'ASC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { roles, total }, 'Roles list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index
};