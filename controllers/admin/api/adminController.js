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
const { User } = require('../../../models/User');

const index = async (req, res) => {
    try {
        const { id: loggedInAdminId } = req.user;
        const { page = 1, length = 10 } = req.query;
        const offset = (page - 1) * length;

        const { count: total, rows: admins } = await User.findAndCountAll({
            where: {
                role: 'admin',
                id: { [Op.ne]: loggedInAdminId }
            },
            order: [['id', 'DESC']],
            limit: parseInt(length),
            offset: parseInt(offset),
        });

        return response(res, { admins, total }, 'Admin list retrieved successfully.', 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            email: 'required|email',
            username: 'required',
            mobile: 'required',
            password: 'required|same:confirmPassword',
            confirmPassword: 'required|same:password'
        });

        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation error', 422);
        }
        let errors = {};

        const {
            name,
            email,
            username,
            mobile,
            password
        } = req.body;

        const nameCount = await User.count({
            where: {
                name: { [Op.eq]: name }
            }
        })

        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            }
        }

        const usernameCount = await User.count({
            where: {
                username: { [Op.eq]: username }
            }
        });
        if (usernameCount > 0) {
            errors['username'] = {
                message: 'The username already exists.',
                rule: 'unique'
            }
        }

        const emailCount = await User.count({
            where: {
                email: { [Op.eq]: email }
            }
        });
        if (emailCount > 0) {
            errors['email'] = {
                message: 'The email already exists.',
                rule: 'unique'
            }
        }

        const mobileNoCount = await User.count({
            where: {
                mobile: { [Op.eq]: mobile }
            }
        });
        if (mobileNoCount > 0) {
            errors['mobile'] = {
                message: 'This Mobile no already exists.',
                rule: 'unique'
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const admin = new User();
        admin.name = name;
        admin.email = email;
        admin.username = username;
        admin.mobile = mobile;
        admin.role = 'admin';
        admin.status = 'active'
        admin.password = bcrypt.hashSync(password, salt);
        await admin.save();

        const subject = 'Admin Account Created Successfully';
        const content = `
            <div>
                <p>Dear ${name},</p>
                <p>Your admin account has been successfully created. Below are your login details:</p>
                <ul>
                    <li><strong>Username:</strong> ${username}</li>
                    <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>Use your registered email or username to log in.</p>
                <p>Thank you!</p>
            </div>
        `;

        const emailContent = await ejs.renderFile(emailTemplatePath, {
            user: name,
            title: subject,
            content: content
        });

        const mailOptions = {
            ...mailOption,
            to: email,
            subject,
            html: emailContent
        };

        await transporter.sendMail(mailOptions);

        return response(res, admin, 'Admin created successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const show = async (req, res) => {
    try {
        const { id } = req.params
        const admin = await User.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });

        if (!admin) {
            return response(res, {}, 'Admin not found.', 404)
        }
        return response(res, admin, 'Admin details retrieved sucessfully.', 200)
    } catch (error) {
        return response(res, req.body.error.message, 500)
    }
}

const update = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            email: 'required|email',
            username: 'required',
            mobile: 'required'
        });

        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation error', 422);
        }
        let errors = {};
        const { id } = req.params;

        const {
            name,
            email,
            username,
            mobile
        } = req.body;

        const nameCount = await User.count({
            where: {
                [Op.and]: [
                    { name: { [Op.eq]: name } },
                    { id: { [Op.ne]: id } }
                ]
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        const emailCount = await User.count({
            where: {
                [Op.and]: [
                    { email: { [Op.eq]: email } },
                    { id: { [Op.ne]: id } }
                ]
            }
        });
        if (emailCount > 0) {
            errors['email'] = {
                message: 'The email already exists.',
                rule: 'unique'
            };
        }

        const usernameCount = await User.count({
            where: {
                [Op.and]: [
                    { username: { [Op.eq]: username } },
                    { id: { [Op.ne]: id } }
                ]
            }
        });
        if (usernameCount > 0) {
            errors['username'] = {
                message: 'The username already exists.',
                rule: 'unique'
            };
        }
        
        const mobileCount = await User.count({
            where: {
                [Op.and]: [
                    { mobile: { [Op.eq]: mobile } },
                    { id: { [Op.ne]: id } }
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
            return response(res, errors, 'Validation error', 422);
        }

        const admin = await User.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });

        if (!admin) {
            return response(res, admin, 'Admin not found.', 404);
        }

        admin.name = name;
        admin.username = username;
        admin.mobile = mobile;
        admin.email = email;
        await admin.save()

        return response(res, admin, 'Admin updated successfully.', 200);
    } catch (error) {
        return response(res, req.body.error.message, 500)
    }
};

const destroy = async (req, res) => {
    try {
        const { id } = req.params

        const admin = await User.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        })

        if (!admin) {
            return response(res, {}, 'Admin not found.', 404)
        }

        await admin.destroy()
        return response(res, admin, 'Admin deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500)
    }
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy
};