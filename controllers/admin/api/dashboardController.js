// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../../models/Client');
const { Subscription } = require('../../../models/Subscription');
const { Environment } = require('../../../models/Environment');
const { ClientScenario } = require('../../../models/ClientScenario');
const { Scenario } = require('../../../models/Scenario');
const { User } = require('../../../models/User');
const { Department } = require('../../../models/Department');
const { UserDepartment } = require('../../../models/UserDepartment');

const totalProUser = async (req, res) => {
    try {
        let {
            page =1,
            length =10,
            isPro=1,
            isOnline,
            keywords
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(length);

        const whereCondition = {
            status: 'active',
            role: 'user',
            isPro
        };

        if (isOnline) {
            whereCondition.isOnline = parseInt(isOnline);
        }
        if (keywords) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${keywords}%` } }
            ];
        }

        const total = await User.count({
            where: whereCondition,
        });

        const users = await User.findAll({
            where: whereCondition,
            order: [['id', 'DESC']],
            limit: parseInt(length),
            offset: offset,
            distinct: true,
        });

        return response(res, { users, total }, 'Pro users list retrieved successfully.', 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};


const proUserDetail = async (req, res) => {
    try {
        const { id: proUserId } = req.params;

        const proUser = await User.findOne({
            where: {
                id: { [Op.eq]: proUserId },
                role: 'user',
                isPro: 1
            },
            include: [
                {
                    model: Client
                },
                {
                    model: Department,
                    through: {
                        model: UserDepartment,
                    }
                }
            ]
        });

        if (!proUser) {
            return response(res, {}, 'Pro user not found.', 404);
        }

        return response(res, proUser, 'Pro user detail retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

module.exports = {
    totalProUser,
    proUserDetail
}
