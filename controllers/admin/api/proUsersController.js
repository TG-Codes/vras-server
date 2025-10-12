// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Custom Helper
const { formatedDateTime, formatedDate, futureDate } = require('../../../helpers/custom');

// Common Response
const { response } = require('../../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../../config/mailer');
const ejs = require('ejs');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../../models/Client');
const { Subscription } = require('../../../models/Subscription');
const { Environment } = require('../../../models/Environment');
const { ClientScenario } = require('../../../models/ClientScenario');
const { Scenario } = require('../../../models/Scenario');
const { User } = require('../../../models/User');

const listProUsers = async (req, res) => {
    try {
        const { 
            page, 
            length, 
            isOnline, 
            keywords, 
            sortBy = 'name', 
            sortOrder = 'ASC' 
        } = req.query;
        const {
            id: clientId
        } = req.params;
        const currentPage = page > 0 ? parseInt(page) : 1;
        const pageSize = length > 0 ? parseInt(length) : 10;
        const offset = (currentPage - 1) * pageSize;

        // Build where condition
        const whereCondition = {
            role: 'user',
            isPro: 1,
            clientId: clientId,
        };

        if (isOnline !== undefined) {
            whereCondition.isOnline = parseInt(isOnline);
        }

        if (keywords) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${keywords}%` } },
                { email: { [Op.like]: `%${keywords}%` } },
                { username: { [Op.like]: `%${keywords}%` } }
            ];
        }

        // Build order clause
        let orderClause = [['name', sortOrder]];
        if (sortBy === 'isOnline') {
            orderClause = [['isOnline', sortOrder], ['updatedAt', 'DESC']];
        } else if (sortBy === 'lastActivity') {
            orderClause = [['updatedAt', sortOrder]];
        } else if (sortBy === 'role') {
            orderClause = [['role', sortOrder]];
        }

        const { count: total, rows: proUsers } = await User.findAndCountAll({
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
            limit: pageSize,
            offset: offset,
        });

        // Add online status information to each user
        const usersWithOnlineStatus = proUsers.map(user => {
            const userData = user.toJSON();
            userData.onlineStatus = {
                isOnline: userData.isOnline === 1,
                statusText: userData.isOnline === 1 ? 'Online' : 'Offline',
                lastActivity: userData.updatedAt,
                clientOnline: userData.client?.isOnline === 1
            };
            return userData;
        });

        return response(res, { 
            proUsers: usersWithOnlineStatus, 
            total,
            page: currentPage,
            length: pageSize,
            totalPages: Math.ceil(total / pageSize),
            onlineCount: usersWithOnlineStatus.filter(u => u.isOnline === 1).length,
            offlineCount: usersWithOnlineStatus.filter(u => u.isOnline === 0).length
        }, "ProUsers list with online status", 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};