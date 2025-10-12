// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Custom Helper
const { formatedDateTime, formatedDate, futureDate } = require('../../helpers/custom');

// Common Response
const { response } = require('../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../config/mailer');
const ejs = require('ejs');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../models/Client');
const { Subscription } = require('../../models/Subscription');
const { User } = require('../../models/User');

const show = async (req, res) => {
    try {
        const { clientId } = req.user;

        const client = await Client.findOne({
            include: [Subscription, User],
            where: {
                id: { [Op.eq]: clientId }
            }
        });
        if (!client) {
            return response(res, client, 'Client not found.', 404);
        }

        return response(res, client, 'Client details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            email: 'required|email',
            mobile: 'required',
            subscriptionId: 'sometimes',
            numberOfUsers: 'requiredWith:subscriptionId|numeric'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const { clientId } = req.user;
        const {
            name,
            email,
            mobile,
            address,
            city,
            country,
            postalCode,
            subscriptionId,
            numberOfUsers,
            startAt,
            endAt,
            payStatus,
            status
        } = req.body;

        const nameCount = await Client.count({
            where: {
                [Op.and]: [
                    { name: { [Op.eq]: name } },
                    { id: { [Op.ne]: clientId } }
                ]
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        const emailCount = await Client.count({
            where: {
                [Op.and]: [
                    { email: { [Op.eq]: email } },
                    { id: { [Op.ne]: clientId } }
                ]
            }
        });
        if (emailCount > 0) {
            errors['email'] = {
                message: 'The email already exists.',
                rule: 'unique'
            };
        }

        const mobileCount = await Client.count({
            where: {
                [Op.and]: [
                    { mobile: { [Op.eq]: mobile } },
                    { id: { [Op.ne]: clientId } }
                ]
            }
        });
        if (mobileCount > 0) {
            errors['mobile'] = {
                message: 'The mobile already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const client = await Client.findOne({
            where: {
                id: { [Op.eq]: clientId }
            }
        });
        if (!client) {
            return response(res, client, 'Client not found.', 404);
        }

        client.name = name;
        client.email = email;
        client.mobile = mobile;
        if (address) {
            client.address = address;
        }
        if (city) {
            client.city = city;
        }
        if (country) {
            client.country = country;
        }
        if (postalCode) {
            client.postalCode = postalCode;
        }
        // if (subscriptionId) {
        //     client.subscriptionId = subscriptionId;
        //     client.numberOfUsers = numberOfUsers;
        // }
        // if (startAt) {
        //     client.startAt = startAt;
        // }
        // if (endAt) {
        //     client.endAt = endAt;
        // }
        // if (payStatus) {
        //     client.payStatus = payStatus;
        // }
        // if (status) {
        //     client.status = status;
        // }
        await client.save();

        return response(res, client, 'Client updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    show,
    update
};