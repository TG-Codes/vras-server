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
        const {
            page = 1,
            length = 10,
            isPro = 1,
            isOnline,
            keywords
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(length);

        const whereCondition = {
            role: 'user',
            isPro: parseInt(isPro),
        };

        if (isOnline) {
            whereCondition.isOnline = parseInt(isOnline);
        }

        if (keywords) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${keywords}%` } },
                { email: { [Op.like]: `%${keywords}%` } },
            ];
        }

        const { count: total, rows: users } = await User.findAndCountAll({
            where: whereCondition,
            order: [
                ['id', 'DESC']
            ],
            limit: parseInt(length),
            offset: offset
        });

        return response(res, { users, total }, 'Pro users list retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const missionsList = async (req, res) => {
    try {
        let { page = 1, length = 10, status } = req.query;
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
            order: [['id', 'DESC']],
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
                    model: User,
                    where: {
                        // isPro: 1,
                        role: 'user'
                    }
                }
            ]
        });

        return response(res, sessions, 'Sessions List.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

const analyticsData = async (req, res) => {
    try {
        const { id : userId } = req.user;

        const userMissions = await UserMission.findAll({
            where: {
                userId: { [Op.eq]: userId }
            },
            include: [ Mission ],
            order: [['id', 'DESC']]
        });

        if (!userMissions.length) {
            return response(res, {}, 'No missions found for this user.', 404);
        }

        const totalData = {
            assaultTime: 0,
            totalTerrorist: 0,
            bulletsFired: 0,
            bulletsOnTerrorist: 0,
            bulletsOnCrowd: 0,
            accuracy: 0,
            casualities: 0,
            survived: 0,
            confirmedKills: 0,
            playersDamage: 0,
            responseTime: 0
        };

        userMissions.forEach(mission => {
            totalData.assaultTime += mission.assaultTime || 0;
            totalData.totalTerrorist += mission.totalTerrorist || 0;
            totalData.bulletsFired += mission.bulletsFired || 0;
            totalData.bulletsOnTerrorist += mission.bulletsOnTerrorist || 0;
            totalData.bulletsOnCrowd += mission.bulletsOnCrowd || 0;
            totalData.accuracy += mission.accuracy || 0;
            totalData.casualities += mission.casualities || 0;
            totalData.survived += mission.survived || 0;
            totalData.confirmedKills += mission.confirmedKills || 0;
            totalData.playersDamage += mission.playersDamage || 0;
            totalData.responseTime += mission.responseTime || 0;
        });

        if (userMissions.length > 0) {
            totalData.accuracy /= userMissions.length;
        }

        return response(res, { userMissions, totalData }, 'User missions list');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

module.exports = {
    proUsersList,
    missionsList,
    missionsDetails,
    liveSessionsList,
    analyticsData
};