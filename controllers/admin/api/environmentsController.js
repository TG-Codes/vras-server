// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Environment } = require('../../../models/Environment');

const index = async (req, res) => {
    try {
        let { page, length } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: environments } = await Environment.findAndCountAll({
            order: [
                ['createdAt', 'DESC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { environments, total }, 'Environments list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const {
            name,
            description
        } = req.body;

        const nameCount = await Environment.count({
            where: {
                name: { [Op.eq]: name }
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'Validation', 422);
        }

        const environment = new Environment();
        environment.name = name;
        environment.description = description;
        await environment.save();

        return response(res, environment, 'Environment saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const environment = await Environment.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!environment) {
            return response(res, environment, 'Environment not found.', 404);
        }

        return response(res, environment, 'Environment details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const { name, description } = req.body;

        const nameCount = await Environment.count({
            where: {
                [Op.and]: [
                    { name: { [Op.eq]: name } },
                    { id: { [Op.ne]: id } }
                ]
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'Validation', 422);
        }

        const environment = await Environment.findOne({
            where: { id: { [Op.eq]: id } }
        });
        if (!environment) {
            return response(res, environment, 'Environment not found.', 404);
        }

        environment.name = name;
        if (description) {
            environment.description = description;
        }
        await environment.save();

        return response(res, environment, 'Environment updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const environment = await Environment.findOne({
            where: { id: { [Op.eq]: id } }
        });
        if (!environment) {
            return response(res, environment, 'Environment not found.', 404);
        }

        await environment.destroy();

        return response(res, environment, 'Environment deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy
};
