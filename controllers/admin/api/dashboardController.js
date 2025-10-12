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
            page = 1,
            length = 10,
            isPro = 1,
            isOnline,
            keywords,
            sortBy = 'id',
            sortOrder = 'DESC',
            clientId
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(length);

        const whereCondition = {
            status: 'active',
            role: 'user',
            isPro: parseInt(isPro)
        };

        if (isOnline !== undefined) {
            whereCondition.isOnline = parseInt(isOnline);
        }

        if (clientId) {
            whereCondition.clientId = parseInt(clientId);
        }

        if (keywords) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${keywords}%` } },
                { email: { [Op.like]: `%${keywords}%` } },
                { username: { [Op.like]: `%${keywords}%` } }
            ];
        }

        // Build order clause
        let orderClause = [['id', sortOrder]];
        if (sortBy === 'isOnline') {
            orderClause = [['isOnline', sortOrder], ['updatedAt', 'DESC']];
        } else if (sortBy === 'lastActivity') {
            orderClause = [['updatedAt', sortOrder]];
        } else if (sortBy === 'name') {
            orderClause = [['name', sortOrder]];
        } else if (sortBy === 'client') {
            orderClause = [['clientId', sortOrder]];
        }

        const total = await User.count({
            where: whereCondition,
        });

        const users = await User.findAll({
            where: whereCondition,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name', 'status', 'isOnline'],
                    required: false
                }
            ],
            order: orderClause,
            limit: parseInt(length),
            offset: offset,
            distinct: true,
        });

        // Add comprehensive online status information
        const usersWithOnlineStatus = users.map(user => {
            const userData = user.toJSON();
            userData.onlineStatus = {
                isOnline: userData.isOnline === 1,
                statusText: userData.isOnline === 1 ? 'Online' : 'Offline',
                statusColor: userData.isOnline === 1 ? 'green' : 'gray',
                lastActivity: userData.updatedAt,
                clientOnline: userData.client?.isOnline === 1,
                clientStatus: userData.client?.status || 'N/A'
            };
            return userData;
        });

        // Get online statistics
        const onlineStats = {
            totalOnline: usersWithOnlineStatus.filter(u => u.isOnline === 1).length,
            totalOffline: usersWithOnlineStatus.filter(u => u.isOnline === 0).length,
            onlineByClient: {}
        };

        // Group online users by client
        usersWithOnlineStatus.forEach(user => {
            const clientName = user.client?.name || 'No Client';
            if (!onlineStats.onlineByClient[clientName]) {
                onlineStats.onlineByClient[clientName] = { online: 0, offline: 0 };
            }
            if (user.isOnline === 1) {
                onlineStats.onlineByClient[clientName].online++;
            } else {
                onlineStats.onlineByClient[clientName].offline++;
            }
        });

        return response(res, { 
            users: usersWithOnlineStatus, 
            total,
            page: parseInt(page),
            length: parseInt(length),
            totalPages: Math.ceil(total / parseInt(length)),
            onlineStats,
            filters: {
                isOnline,
                keywords,
                clientId,
                sortBy,
                sortOrder
            }
        }, 'Pro users list with online status retrieved successfully.', 200);
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
