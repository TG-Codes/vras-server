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
const { Department } = require('../../../models/Department');
const { Mission } = require('../../../models/Mission');
const { Environment } = require('../../../models/Environment');
const { Scenario } = require('../../../models/Scenario');
const { User } = require('../../../models/User');
const { UserMission } = require('../../../models/UserMission');

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            userId: 'required',
            missionId: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { clientId } = req.user;
        let errors = {};
        
        const {
            userId,
            missionId,
            assaultTime,
            mode,
            totalTerrorist,
            bulletsFired,
            bulletsOnTerrorist,
            bulletsOnCrowd,
            accuracy,
            casualities,
            survived,
            confirmedKills,
            playersDamage,
            responseTime,
            feedback,
            status
        } = req.body;

        // const userMissionCount = await UserMission.count({
        //     where: {
        //         [Op.and]: [
        //             { missionId: { [Op.eq]: missionId } },
        //             { clientId: { [Op.eq]: clientId } }
        //         ]
        //     }
        // });
        // if (userMissionCount > 0) {
        //     errors['missionId'] = {
        //         message: 'The mission already exists for this user.',
        //         rule: 'unique'
        //     }
        // }

        // if (Object.keys(errors).length > 0) {
        //     return response(res, errors, 'validation', 422);
        // }

        const userMission = new UserMission();
        userMission.clientId = clientId;
        userMission.userId = userId;
        userMission.missionId = missionId;
        if (assaultTime) {
            userMission.assaultTime = assaultTime;
        }
        if (mode) {
            userMission.mode = mode;
        }
        if (totalTerrorist) {
            userMission.totalTerrorist = totalTerrorist;
        }
        if (bulletsFired) {
            userMission.bulletsFired = bulletsFired;
        }
        if (bulletsOnTerrorist) {
            userMission.bulletsOnTerrorist = bulletsOnTerrorist;
        }
        if (bulletsOnCrowd) {
            userMission.bulletsOnCrowd = bulletsOnCrowd;
        }
        if (accuracy) {
            userMission.accuracy = accuracy;
        }
        if (casualities) {
            userMission.casualities = casualities;
        }
        if (survived) {
            userMission.survived = survived;
        }
        if (confirmedKills) {
            userMission.confirmedKills = confirmedKills;
        }
        if (playersDamage) {
            userMission.playersDamage = playersDamage;
        }
        if (responseTime) {
            userMission.responseTime = responseTime;
        }
        if (feedback) {
            userMission.feedback = feedback;
        }
        if (status) {
            userMission.status = status;
        }
        await userMission.save();
        
        return response(res, userMission, 'User Mission created successfully.');
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

// const show = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const { hideFields } = req.query;

//         const mission = await Mission.findOne({
//             include: [Client],
//             where: {
//                 id: { [Op.eq]: id }
//             }
//         });
//         if (!mission) {
//             return response(res, mission, 'Mission not found.', 404);
//         }

//         const userMissions = await UserMission.findAll({
//             where: {
//                 missionId: { [Op.eq]: id }
//             },
//             order: [['id', 'DESC']]
//         });

//         const totalData = {
//             assaultTime: 0,
//             totalTerrorist: 0,
//             bulletsFired: 0,
//             bulletsOnTerrorist: 0,
//             bulletsOnCrowd: 0,
//             accuracy: 0,
//             casualities: 0,
//             survived: 0,
//             confirmedKills: 0,
//             playersDamage: 0,
//             responseTime: 0
//         }

//         userMissions.forEach(mission => {
//             totalData.assaultTime += mission.assaultTime || 0;
//             totalData.totalTerrorist += mission.totalTerrorist || 0;
//             totalData.bulletsFired += mission.bulletsFired || 0;
//             totalData.bulletsOnTerrorist += mission.bulletsOnTerrorist || 0;
//             totalData.bulletsOnCrowd += mission.bulletsOnCrowd || 0;
//             totalData.accuracy += mission.accuracy || 0;
//             totalData.casualities += mission.casualities || 0;
//             totalData.survived += mission.survived || 0;
//             totalData.confirmedKills += mission.confirmedKills || 0;
//             totalData.playersDamage += mission.playersDamage || 0;
//             totalData.responseTime += mission.responseTime || 0;
//         });

//         if (userMissions.length > 0) {
//             totalData.accuracy /= userMissions.length;
//         }

//         if (hideFields) {
//             const fieldsToHide = hideFields.split(',');
//             fieldsToHide.forEach(field => {
//                 delete totalData[field.trim()];
//             });
//         }

//         return response(res, { mission, totalData }, 'User missions list');
//     } catch (error) {
//         return response(res, req.body, error.message, 500);
//     }
// };

const show = async (req, res) => {
    try {
        const { id: userId } = req.params;

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
    store,
    show
};