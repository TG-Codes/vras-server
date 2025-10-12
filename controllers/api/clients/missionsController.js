// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Common Response
const { response } = require('../../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../../config/mailer');
const ejs = require('ejs');
const { formatedDateTime, formatedDate, futureDate } = require('../../../helpers/custom');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../../models/Client');
const { Department } = require('../../../models/Department');
const { Mission } = require('../../../models/Mission');
const { User } = require('../../../models/User');
const { Environment } = require('../../../models/Environment');
const { Scenario } = require('../../../models/Scenario');

const getClientDetails = async (req, res) => {
    try {
        const { clientId } = req.user;

        const clientDetails = await Client.findOne({
            where: { id: clientId },
            include: [
                {
                    model: Environment,
                },
                {
                    model: Scenario,
                },
                {
                    model: Department,
                },
            ],
        });

        if (!clientDetails) {
            return response(res, {}, 'Client not found', 404);
        }

        return response(res, clientDetails, 'Client details fetched successfully', 200);
    } catch (error) {
        console.error(error);
        return response(res, {}, error.message, 500);
    }
};

// const getClientDetails = async (req, res) => {
//     try {
//         const { clientId } = req.user;
//         const { includeEnvironment, includeScenario, includeDepartment } = req.query;

//         const clientDetails = await Client.findOne({ where: { id: clientId } });

//         if (!clientDetails) {
//             return response(res, {}, 'Client not found', 404);
//         }

//         const details = { client: clientDetails };

//         if (includeEnvironment === 'true') {
//             const environments = await Environment.findAll({
//                 include: [
//                     {
//                         model: Mission,
//                         where: { clientId },
//                         required: true,
//                     },
//                 ],
//             });
//             details.environments = environments;

//             if (includeScenario === 'true') {
//                 for (const env of environments) {
//                     const scenarios = await Scenario.findAll({ where: { environmentId: env.id } });
//                     env.dataValues.scenarios = scenarios;
//                 }
//             }
//         }

//         if (includeDepartment === 'true') {
//             const departments = await Department.findAll({ where: { clientId } });
//             details.departments = departments;
//         }

//         return response(res, details, 'Client details fetched successfully', 200);
//     } catch (error) {
//         console.error(error);
//         return response(res, {}, error.message, 500);
//     }
// };

const index = async (req, res) => {
    try {
        let {
            page,
            length,
            status
        } = req.query;

        const { clientId } = req.user;
        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const whereCondition = {
            clientId
        };

        if (status) {
            if (status.toLowerCase() === 'active') {
                whereCondition.status = "active";
            }
        }

        const { count: total, rows: missions } = await Mission.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Client },
                { model: Environment },
                { model: Scenario },
                { model: Department }
            ],
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset: offset
        });

        return response(res, { missions, total }, 'Missions list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            environmentId: 'required',
            scenarioId: 'required',
            departmentId: 'required',
            startAt: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const { clientId } = req.user;
        const {
            name,
            description,
            environmentId,
            scenarioId,
            departmentId,
            startAt,
            endAt,
            status
        } = req.body;

        const nameCount = await Mission.count({
            where: {
                [Op.and]: [
                    { name: { [Op.eq]: name } },
                    { clientId: { [Op.eq]: clientId } }
                ]
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists for this client.',
                rule: 'unique'
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const mission = new Mission();
        mission.clientId = clientId;
        mission.environmentId = environmentId;
        mission.scenarioId = scenarioId;
        mission.departmentId = departmentId;
        mission.name = name;
        mission.startAt = formatedDateTime(startAt);
        if (description) {
            mission.description = description;
        }
        if (endAt) {
            mission.endAt = endAt;
        }
        if (status) {
            mission.status = status;
        }
        await mission.save();

        return response(res, mission, 'Mission created successfully.');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const mission = await Mission.findOne({
            include: [
                { model: Client },
                { model: Environment },
                { model: Scenario },
                { model: Department }
            ],
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!mission) {
            return response(res, mission, 'Mission not found.', 404);
        }

        return response(res, mission, 'Mission found.');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            environmentId: 'required',
            scenarioId: 'required',
            departmentId: 'required',
            startAt: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const { clientId } = req.user;
        const {
            name,
            description,
            environmentId,
            scenarioId,
            departmentId,
            startAt,
            endAt,
            status
        } = req.body;

        if (name) {
            const nameCount = await Mission.count({
                where: {
                    [Op.and]: [
                        { name: { [Op.eq]: name } },
                        { clientId: { [Op.eq]: clientId } },
                        { id: { [Op.ne]: id } }
                    ]
                }
            });
            if (nameCount > 0) {
                errors['name'] = {
                    message: 'The name already exists for this client.',
                    rule: 'unique'
                };
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const mission = await Mission.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!mission) {
            return response(res, mission, 'Mission not found.', 404);
        }

        if (name) {
            mission.name = name;
        }
        if (description) {
            mission.description = description;
        }
        if (environmentId) {
            mission.environmentId = environmentId;
        }
        if (scenarioId) {
            mission.scenarioId = scenarioId;
        }
        if (departmentId) {
            mission.departmentId = departmentId;
        }
        if (startAt) {
            mission.startAt = startAt;
        }
        if (endAt) {
            mission.endAt = endAt;
        }
        if (status) {
            mission.status = status;
        }
        await mission.save();

        return response(res, mission, 'Mission updated successfully.');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const mission = await Mission.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!mission) {
            return response(res, mission, 'Mission not found.', 404);
        }

        await mission.destroy();

        return response(res, mission, 'Mission deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    getClientDetails,
    index,
    store,
    show,
    update,
    destroy
};