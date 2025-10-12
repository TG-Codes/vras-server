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
const { Environment } = require('../../../models/Environment');
const { UserDepartment } = require('../../../models/UserDepartment');
const { User } = require('../../../models/User');

const index = async (req, res) => {
    try {
        const { page = 1, length = 10, isOnline, isPro, keywords } = req.query;
        const { clientId } = req.user;

        const offset = (parseInt(page) - 1) * parseInt(length);

        const whereCondition = {
            role: 'user',
            clientId: clientId
        };

        if (isOnline) {
            whereCondition.isOnline = parseInt(isOnline);
        }

        if (isPro) {
            whereCondition.isPro = parseInt(isPro);
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
            offset: offset,
            distinct: true
        });

        let message;
        if (isOnline && isPro) {
            message = 'Online pro users list retrieved successfully.';
        } else if (isOnline) {
            message = 'Online users list retrieved successfully.';
        } else {
            message = 'Users list retrieved successfully.';
        }

        return response(res, { users, total }, message, 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

module.exports = {
    index
};