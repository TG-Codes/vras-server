// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Common Response
const { response } = require('../../../config/response');

const { formatedDateTime, formatedDate, futureDate } = require('../../../helpers/custom');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../../config/mailer');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../../models/Client');
const { Scenario } = require('../../../models/Scenario');
const { User } = require('../../../models/User');
const { Session } = require('../../../models/Session');
const { UserSession } = require('../../../models/UserSession');
const { UserDepartment } = require('../../../models/UserDepartment');
const { Department } = require('../../../models/Department');
const { ClientScenario } = require('../../../models/ClientScenario');
const session = require('express-session');

const scenariosList = async (req, res) => {
    try {
        const { clientId } = req.user;

        const clientScenarios = await ClientScenario.findAll({
            where: {
                clientId,
            },
            include: [
                {
                    model: Scenario,
                    required: true,
                },
            ],
        });

        return response(res, clientScenarios, 'Scenarios fetched successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

const index = async (req, res) => {
    try {
        let {
            page,
            length
        } = req.query

        const { clientId } = req.user;

        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { count: total, rows: sessions } = await Session.findAndCountAll({
            where: { clientId },
            include: [
                {
                    model: Scenario,
                },
                {
                    model: User
                }
            ],
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset: offset,
            distinct: true
        });
        return response(res, { sessions, total }, 'Sessions fetched successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            scenarioId: 'required',
            userIds: 'required|array'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation error', 422);
        }
        let errors = {};
        const { clientId } = req.user;

        const {
            name,
            startAt,
            endAt,
            scenarioId,
            userIds,
            notes,
            sessionRecording,
            status
        } = req.body;

        const sessionCount = await Session.count({
            where: {
                name: { [Op.eq]: name },
                clientId: { [Op.eq]: clientId }
            }
        });

        if (sessionCount > 0) {
            errors['name'] = {
                message: 'This Live Session name already exists.',
                rule: 'unique'
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'Validation', 422);
        }

        const session = new Session()
        session.clientId = clientId;
        session.scenarioId = scenarioId;
        session.name = name;
        if (startAt) {
            session.startAt = formatedDateTime(startAt);
        }
        if (endAt) {
            session.endAt = formatedDateTime(endAt);
        }
        if (notes) {
            session.notes = notes;
        }
        if (sessionRecording) {
            session.sessionRecording = sessionRecording;
        }
        if (status) {
            session.status = status;
        }

        for (const userId of userIds) {
            session.userId = userId;
            await session.save();

            const userSession = new UserSession();
            userSession.sessionId = session.id;
            userSession.userId = userId;
            await userSession.save();
        }

        return response(res, session, 'Live Session created successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.user;

        const session = await Session.findOne({
            where: {
                id,
                clientId
            },
            include: [
                {
                    model: Scenario
                },
                {
                    model: User,
                    include: [
                        {
                            model: Department,
                        }
                    ]
                }
            ]
        });

        if (!session) {
            return response(res, null, 'Session not found', 404);
        }

        return response(res, session, 'Session details fetched successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.user;

        const session = await Session.findOne({
            where: { id, clientId }
        });

        if (!session) {
            return response(res, null, 'Session not found', 404);
        }

        const validator = new Validator(req.body, {
            name: 'required',
            startAt: 'required|date',
            endAt: 'required|date',
            scenarioId: 'required',
            userIds: 'required|array'
        });

        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation error', 422);
        }

        const {
            name,
            startAt,
            endAt,
            scenarioId,
            userIds,
            notes,
            sessionRecording,
            status
        } = req.body;

        const sessionCount = await Session.count({
            where: {
                name: { [Op.eq]: name },
                clientId: { [Op.eq]: clientId },
                id: { [Op.ne]: id }
            }
        });

        if (sessionCount > 0) {
            return response(res, { name: 'Session name already exists for this client.' }, 'Validation error', 422);
        }

        session.name = name;
        session.startAt = formatedDateTime(startAt);
        session.endAt = formatedDateTime(endAt);
        session.scenarioId = scenarioId;
        if (notes) {
            session.notes = notes;
        }
        if (sessionRecording) {
            session.sessionRecording = sessionRecording;
        }
        if (status) {
            session.status = status;
        }
        await session.save();

        await UserSession.destroy({
            where: { sessionId: id }
        });

        for (const userId of userIds) {
            const userSession = new UserSession();
            userSession.sessionId = session.id;
            userSession.userId = userId;
            await userSession.save();
        }

        return response(res, session, 'Live Session updated successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

const destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.user;

        const session = await Session.findOne({
            where: {
                id,
                clientId
            }
        });

        if (!session) {
            return response(res, null, 'Session not found', 404);
        }

        await UserSession.destroy({
            where: {
                sessionId: id
            }
        });
        await session.destroy();

        return response(res, null, 'Session deleted successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

module.exports = {
    scenariosList,
    index,
    store,
    show,
    update,
    destroy
};