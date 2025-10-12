// const { Validator } = require('node-input-validator');
// const { response } = require('../../../config/response');
// const { Op } = require('sequelize');
// const { Mission } = require('../../../models/Mission');
// const { Client } = require('../../../models/Client');

// const index = async (req, res) => {
//     try {
//         let { page, length, status } = req.query;
//         const { clientId } = req.user;

//         page = page > 0 ? parseInt(page) : 1;
//         length = length > 0 ? parseInt(length) : 10;
//         const offset = (page - 1) * length;

//         const whereCondition = { clientId };
//         if (status) {
//             whereCondition.status = status;
//         }

//         const { count: total, rows: missions } = await Mission.findAndCountAll({
//             where: whereCondition,
//             order: [['id', 'DESC']],
//             limit: length,
//             offset,
//         });

//         return response(res, { missions, total }, 'Missions retrieved successfully.', 200);
//     } catch (error) {
//         return response(res, req.body, error.message, 500);
//     }
// };

// const store = async (req, res) => {
//     try {
//         const validator = new Validator(req.body, {
//             name: 'required|string',
//             environmentId: 'required|integer',
//             scenarioId: 'required|integer',
//             departmentId: 'required|integer',
//             startAt: 'required|date',
//             endAt: 'required|date',
//         });
//         const matched = await validator.check();
//         if (!matched) {
//             return response(res, validator.errors, 'Validation failed', 422);
//         }

//         const { clientId } = req.user;
//         const { name, description, environmentId, scenarioId, departmentId, startAt, endAt, status } = req.body;

//         const existingMission = await Mission.findOne({
//             where: { name, clientId },
//         });
//         if (existingMission) {
//             return response(res, { name: 'Name already exists for this client.' }, 'Validation failed', 422);
//         }

//         const mission = await Mission.create({
//             clientId,
//             name,
//             description,
//             environmentId,
//             scenarioId,
//             departmentId,
//             startAt,
//             endAt,
//             status: status || 'active',
//         });

//         return response(res, mission, 'Mission created successfully.', 201);
//     } catch (error) {
//         return response(res, req.body, error.message, 500);
//     }
// };

// const show = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const mission = await Mission.findOne({
//             include: [Client],
//             where: { id },
//         });
//         if (!mission) {
//             return response(res, null, 'Mission not found.', 404);
//         }

//         return response(res, mission, 'Mission details retrieved.', 200);
//     } catch (error) {
//         return response(res, req.body, error.message, 500);
//     }
// };

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required|string',
            environmentId: 'required|integer',
            scenarioId: 'required|integer',
            departmentId: 'required|integer',
            startAt: 'required|date',
            endAt: 'required|date',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation failed', 422);
        }

        const { id } = req.params;
        const { clientId } = req.user;
        const { name, description, environmentId, scenarioId, departmentId, startAt, endAt, status } = req.body;

        const mission = await Mission.findOne({ where: { id, clientId } });
        if (!mission) {
            return response(res, null, 'Mission not found.', 404);
        }

        mission.name = name;
        mission.description = description || mission.description;
        mission.environmentId = environmentId;
        mission.scenarioId = scenarioId;
        mission.departmentId = departmentId;
        mission.startAt = startAt;
        mission.endAt = endAt;
        mission.status = status || mission.status;

        await mission.save();

        return response(res, mission, 'Mission updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

// const destroy = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const mission = await Mission.findOne({ where: { id } });
//         if (!mission) {
//             return response(res, null, 'Mission not found.', 404);
//         }

//         await mission.destroy();

//         return response(res, null, 'Mission deleted successfully.', 200);
//     } catch (error) {
//         return response(res, req.body, error.message, 500);
//     }
// };

// module.exports = {
//     index,
//     store,
//     show,
//     update,
//     destroy,
// };

const { Client } = require('../../../models/Client');
const { Environment } = require('../../../models/Environment');
const { Scenario } = require('../../../models/Scenario');
const { Department } = require('../../../models/Department');
const { response } = require('../../../config/response'); // Assuming a response utility is available

const getClientDetails = async (req, res) => {
    try {
        const { clientId } = req.user; // Assuming clientId is available in the authenticated user's payload

        const clientDetails = await Client.findOne({
            where: { id: clientId },
            include: [
                {
                    model: Environment,
                    include: [
                        {
                            model: Scenario,
                            as: 'scenarios', // Adjust if alias is used in your association
                        },
                    ],
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

module.exports = {
    getClientDetails,
};

