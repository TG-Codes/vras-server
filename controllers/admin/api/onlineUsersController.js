// Common Response
const { response } = require('../../../config/response');

// Model
const { Op } = require('sequelize');
const { User } = require('../../../models/User');
const { Client } = require('../../../models/Client');
const { Department } = require('../../../models/Department');
const { UserDepartment } = require('../../../models/UserDepartment');

/**
 * Get all online users with detailed information
 */
const getOnlineUsers = async (req, res) => {
    try {
        const { 
            page = 1, 
            length = 10, 
            clientId, 
            role, 
            departmentId,
            keywords,
            sortBy = 'lastLogin',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(length);

        // Build where condition
        const whereCondition = {
            status: 'active',
            isOnline: 1
        };

        if (clientId) {
            whereCondition.clientId = clientId;
        }

        if (role && role !== 'all') {
            whereCondition.role = role;
        }

        if (keywords) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${keywords}%` } },
                { email: { [Op.like]: `%${keywords}%` } },
                { username: { [Op.like]: `%${keywords}%` } }
            ];
        }

        // Build order clause
        let orderClause = [['updatedAt', sortOrder]];
        if (sortBy === 'name') {
            orderClause = [['name', sortOrder]];
        } else if (sortBy === 'role') {
            orderClause = [['role', sortOrder]];
        } else if (sortBy === 'lastLogin') {
            orderClause = [['updatedAt', sortOrder]];
        }

        const { count: total, rows: onlineUsers } = await User.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name', 'email', 'status', 'isOnline'],
                    required: false
                },
                {
                    model: UserDepartment,
                    as: 'userDepartments',
                    attributes: ['departmentId'],
                    include: [
                        {
                            model: Department,
                            as: 'department',
                            attributes: ['id', 'name'],
                            required: false
                        }
                    ],
                    required: false
                }
            ],
            order: orderClause,
            limit: parseInt(length),
            offset: offset,
            distinct: true
        });

        // Add department information to each user
        const usersWithDepartments = onlineUsers.map(user => {
            const userData = user.toJSON();
            userData.departments = userData.userDepartments?.map(ud => ud.department) || [];
            delete userData.userDepartments;
            return userData;
        });

        return response(res, { 
            onlineUsers: usersWithDepartments, 
            total,
            page: parseInt(page),
            length: parseInt(length),
            totalPages: Math.ceil(total / parseInt(length))
        }, 'Online users retrieved successfully.', 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

/**
 * Get online users statistics
 */
const getOnlineStats = async (req, res) => {
    try {
        const { clientId } = req.query;

        const whereCondition = {
            status: 'active',
            isOnline: 1
        };

        if (clientId) {
            whereCondition.clientId = clientId;
        }

        // Get total online users
        const totalOnline = await User.count({
            where: whereCondition
        });

        // Get online users by role
        const onlineByRole = await User.findAll({
            attributes: [
                'role',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            where: whereCondition,
            group: ['role'],
            raw: true
        });

        // Get online users by client
        const onlineByClient = await User.findAll({
            attributes: [
                'clientId',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            where: whereCondition,
            group: ['clientId'],
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['name'],
                    required: false
                }
            ],
            raw: true
        });

        // Get recently online users (last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentlyOnline = await User.count({
            where: {
                ...whereCondition,
                updatedAt: {
                    [Op.gte]: fiveMinutesAgo
                }
            }
        });

        return response(res, {
            totalOnline,
            recentlyOnline,
            byRole: onlineByRole,
            byClient: onlineByClient,
            timestamp: new Date().toISOString()
        }, 'Online statistics retrieved successfully.', 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

/**
 * Get user activity timeline
 */
const getUserActivity = async (req, res) => {
    try {
        const { userId } = req.params;
        const { days = 7 } = req.query;

        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const user = await User.findOne({
            where: { id: userId },
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['name']
                }
            ]
        });

        if (!user) {
            return response(res, {}, 'User not found.', 404);
        }

        // Get recent login/logout activity (this would need to be implemented with a separate activity log table)
        // For now, we'll return basic user info with online status
        const activityData = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isOnline: user.isOnline,
                lastActivity: user.updatedAt,
                client: user.client?.name || 'No Client'
            },
            currentStatus: user.isOnline ? 'Online' : 'Offline',
            lastSeen: user.updatedAt
        };

        return response(res, activityData, 'User activity retrieved successfully.', 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

/**
 * Force logout a user (admin function)
 */
const forceLogoutUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({
            where: { id: userId },
            include: [Client]
        });

        if (!user) {
            return response(res, {}, 'User not found.', 404);
        }

        // Force logout
        user.token = null;
        user.refreshToken = null;
        user.code = null;
        user.isOnline = 0;
        await user.save();

        if (user.client) {
            user.client.isOnline = 0;
            await user.client.save();
        }

        return response(res, { 
            userId: user.id, 
            name: user.name,
            action: 'force_logout',
            timestamp: new Date().toISOString()
        }, 'User force logged out successfully.', 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

module.exports = {
    getOnlineUsers,
    getOnlineStats,
    getUserActivity,
    forceLogoutUser
};
