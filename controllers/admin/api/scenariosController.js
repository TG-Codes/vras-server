// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Scenario } = require('../../../models/Scenario');
const { Environment } = require('../../../models/Environment');

const index = async (req, res) => {
    try {
        let { page, length } = req.query;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: scenarios } = await Scenario.findAndCountAll({
            include: [Environment],
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { scenarios, total }, 'Scenarios list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            environmentId: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const {
            name,
            environmentId,
            description
        } = req.body;

        const nameCount = await Scenario.count({
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

        const environment = await Environment.findOne({
            where: { id: environmentId }
        });
        if (!environment) {
            return response(res, null, 'Environment not found.', 404);
        }

        const scenario = new Scenario()
        scenario.name = name;
        scenario.environmentId = environmentId;
        scenario.description = description;
        await scenario.save();

        return response(res, scenario, 'Scenario saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const scenario = await Scenario.findOne({
            include: [Environment],
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!scenario) {
            return response(res, scenario, 'Scenario not found.', 404);
        }

        return response(res, scenario, 'Scenario details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            environmentId: 'required',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const {
            name,
            environmentId,
            description
        } = req.body;

        const nameCount = await Scenario.count({
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

        const scenario = await Scenario.findOne({
            where: { id: { [Op.eq]: id } }
        });
        if (!scenario) {
            return response(res, scenario, 'Scenario not found.', 404);
        }

        const environment = await Environment.findOne({
            where: { id: environmentId }
        });
        if (!environment) {
            return response(res, null, 'Environment not found.', 404);
        }

        scenario.name = name;
        scenario.environmentId = environmentId;
        if (description) {
            scenario.description = description;
        }
        await scenario.save();

        return response(res, scenario, 'Scenario updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const scenario = await Scenario.findOne({
            where: { id: { [Op.eq]: id } }
        });
        if (!scenario) {
            return response(res, scenario, 'Scenario not found.', 404);
        }

        await scenario.destroy();

        return response(res, scenario, 'Scenario deleted successfully.', 200);
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
