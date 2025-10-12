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
const { Scenario } = require('../../../models/Scenario');
const { Environment } = require('../../../models/Environment');
const { ClientScenario } = require('../../../models/ClientScenario');
const { User } = require('../../../models/User');

const index = async (req, res) => {
    try {
        console.log(req.user);
        
        const clientId = req.user.clientId;
        const client = await Client.findOne({
            where: { id: clientId },
            include: [
                {
                    model: Environment,
                    required: false
                },
                {
                    model: Scenario,
                    through: ClientScenario,
                    required: false
                },
            ],
        });

        if (!client) {
            return response(res, {}, 'Client not found.', 404);
        }

        return response(res, client, 'Environment and scenarios retrieved successfully.', 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

module.exports = {
    index
};