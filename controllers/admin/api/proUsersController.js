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
        const { page, length } = req.query;
        const {
            id: clientId
        } = req.params;
        const currentPage = page > 0 ? parseInt(page) : 1;
        const pageSize = length > 0 ? parseInt(length) : 10;
        const offset = (currentPage - 1) * pageSize;

        const { count: total, rows: proUsers } = await User.findAndCountAll({
            where: {
                role: 'user',
                isPro: 1,
                clientId: clientId,
            },
            order: [['name', 'ASC']],
            limit: pageSize,
            offset: offset,
        });

        return response(res, { proUsers, total }, "ProUsers list", 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};