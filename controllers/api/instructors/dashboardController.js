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

// Model
const { Op } = require('sequelize');
const { Client } = require('../../../models/Client');
const { User } = require('../../../models/User');
const { Mission } = require('../../../models/Mission');
const { UserMission } = require('../../../models/UserMission');
const { Session } = require('../../../models/Session');
const { Scenario } = require('../../../models/Scenario');
const { UserSession } = require('../../../models/UserSession');
const { UserDepartment } = require('../../../models/UserDepartment');
const { Department } = require('../../../models/Department');

const proUsersList = async (req, res) => {
    try {
        let {
            page = 1,
            length = 10,
            isPro,
            isOnline,
            keywords
        } = req.query;
        
        const { clientId } = req.user;

        page = parseInt(page);
        length = parseInt(length);

        isPro = isPro ? parseInt(isPro) : undefined;

        isOnline = isOnline ? parseInt(isOnline) : undefined;

        const offset = (page - 1) * length;

        const whereCondition = {
            role: 'user',
            clientId
        };

        if (isPro) {
            whereCondition.isPro = isPro;
        }

        if (isOnline) {
            whereCondition.isOnline = isOnline;
        }

        if (keywords) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${keywords}%` } },
                { email: { [Op.like]: `%${keywords}%` } }
            ];
        }

        const { count: total, rows: users } = await User.findAndCountAll({
            where: whereCondition,
            order: [['id', 'DESC']],
            limit: length,
            offset
        });

        return response(res, { users, total }, 'Pro users list retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};


const missionsList = async (req, res) => {
    try {
        let {
            page = 1,
            length = 10,
            status
        } = req.query;
        const { clientId } = req.user;

        page = parseInt(page);
        length = parseInt(length);
        const offset = (page - 1) * length;

        const whereCondition = {
            clientId
        };

        if (status === 'inactive') {
            whereCondition.status = { [Op.ne]: 'active' }
        }

        const { count: total, rows: missions } = await Mission.findAndCountAll({
            where: whereCondition,
            order: [
                ['id', 'DESC']
            ],
            limit: length,
            offset
        });

        return response(res, { missions, total }, 'Missions list retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const missionsDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const mission = await Mission.findOne({
            include: [Client],
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!mission) {
            return response(res, mission, 'Mission not found.', 404);
        }

        const userMissions = await UserMission.findAll({
            where: {
                missionId: { [Op.eq]: id }
            },
            order: [
                ['id', 'DESC']
            ]
        });

        return response(res, { mission, userMissions }, 'User missions list');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const liveSessionsList = async (req, res) => {
    try {
        const { clientId } = req.user;

        const sessions = await Session.findAll({
            where: { clientId },
            include: [
                {
                    model: Scenario
                },
                {
                    model: User
                }
            ]
        });

        return response(res, sessions, 'Sessions List.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

const liveSessionDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.user;

        const sessions = await Session.findOne({
            where: { id, clientId },
            include: [
                {
                    model: Scenario
                },
                {
                    model: User,
                    include: [
                        {
                            model: Department
                        }
                    ]
                }
            ]
        });

        if (!sessions) {
            return response(res, null, 'Live session not found', 404);
        }

        return response(res, sessions, 'Live session details fetched successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

module.exports = {
    proUsersList,
    missionsList,
    missionsDetails,
    liveSessionsList,
    liveSessionDetails
};