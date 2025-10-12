// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Common Response
const { response } = require('../../../config/response');

const { formatedDateTime, formatedDate, futureDate } = require('../../../helpers/custom');

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
        let { page, length, isPro, role, isOnline } = req.query;

        page = page > 0 ? parseInt(page) : 1;
        length = length > 0 ? parseInt(length) : 10;
        let offset = (page - 1) * length;

        const { clientId } = req.user;

        const whereClause = {
            clientId: { [Op.eq]: clientId },
        };

        if (role) {
            whereClause.role = { [Op.eq]: role };
        }

        if (isPro) {
            whereClause.isPro = { [Op.eq]: parseInt(isPro) };
        }
        if (isOnline) {
            whereClause.isOnline = { [Op.eq]: parseInt(isOnline) };
        }

        const { count: total, rows: users } = await User.findAndCountAll({
            include: [
                {
                    model: Client,
                    required: true,
                    where: { id: clientId }
                },
                {
                    model: UserDepartment,
                    include: [Department]
                }
            ],
            where: whereClause,
            order: [['id', 'DESC']],
            limit: length,
            offset: offset,
            distinct: true
        });

        return response(res, { users, total }, 'Users list.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            mobile: 'required|digits:10',
            email: 'required|email',
            username: 'required',
            password: 'required|same:confirmPassword',
            confirmPassword: 'required|same:password',
            departmentIds: 'required|array'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const { clientId } = req.user;
        const {
            departmentIds,
            name,
            lastName,
            countryCode,
            mobile,
            email,
            username,
            role,
            password,
            dateOfBirth,
            gender,
            primaryHand,
            address,
            city,
            country,
            postalCode,
            emergencyContactName,
            emergencyContactPhone,
            medicalConditions,
            allergies,
            notes,
            experienceLevel,
            stressLevel
        } = req.body;

        // fetch client proUsercount and parallel user coun
        //  fetch usertble proUser countr and parallel user count
        //  if client.proUserCount <= user.proUserCount (through validation)
        //  if client.parallelUserCount <= user.parallelUserCount (through validation)

        const client = await Client.findOne({
            where: {
                id: { [Op.eq]: clientId }
            }
        });

        const proUserCount = await User.count({
            where: {
                clientId, isPro: 1
            }
        });

        const parallelUserCount = await User.count({
            where: {
                clientId, isPro: 0
            }
        });

        if (role === 'proUser' && proUserCount >= client.numberOfProUsers) {
            errors['proUserLimit'] = {
                message: 'Pro user limit reached for this client.',
                rule: 'limit'
            };
        }
        else if (role === 'parallelUser' && parallelUserCount >= client.numberOfUsers) {
            errors['parallelUserLimit'] = {
                message: 'parallel user limit reached for this client.',
                rule: 'limit'
            };
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

        const mobileCount = await User.count({
            where: {
                mobile: { [Op.eq]: mobile }
            }
        });
        if (mobileCount > 0) {
            errors['mobile'] = {
                message: 'The mobile already exists.',
                rule: 'unique'
            }
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const user = new User();
        user.clientId = clientId;
        user.name = name;
        if (lastName) {
            user.lastName = lastName;
        }
        user.countryCode = countryCode;
        user.mobile = mobile;
        user.email = email;
        user.username = username;
        if (role === 'instructor') {
            user.role = 'instructor';
            user.isPro = 1;
        } else if (role === 'proUser') {
            user.role = 'user';
            user.isPro = 1;
        } else if (role === 'parallelUser') {
            user.role = 'user';
            user.isPro = 0;
        }
        user.password = bcrypt.hashSync(password, salt); // generate a hash
        if (dateOfBirth) {
            user.dateOfBirth = formatedDate(dateOfBirth);
        }
        if (gender) {
            user.gender = gender;
        }
        if (primaryHand) {
            user.primaryHand = primaryHand;
        }
        if (address) {
            user.address = address;
        }
        if (city) {
            user.city = city;
        }
        if (country) {
            user.country = country;
        }
        if (postalCode) {
            user.postalCode = postalCode;
        }
        if (emergencyContactName) {
            user.emergencyContactName = emergencyContactName;
        }
        if (emergencyContactPhone) {
            user.emergencyContactPhone = emergencyContactPhone;
        }
        if (medicalConditions) {
            user.medicalConditions = medicalConditions;
        }
        if (allergies) {
            user.allergies = allergies;
        }
        if (notes) {
            user.notes = notes;
        }
        if (experienceLevel) {
            user.experienceLevel = experienceLevel;
        }
        if (stressLevel) {
            user.stressLevel = stressLevel;
        }
        await user.save();

        for (const departmentId of departmentIds) {
            const userDepartment = new UserDepartment();
            userDepartment.userId = user.id;
            userDepartment.departmentId = departmentId;
            await userDepartment.save();
        }

        // Mail
        const subject = 'Registration Successful.';
        const content = `<div>
            <p>Congratulations! your profile has been registered successfully.</p>
            <p>Username: ${user?.username}</p>
            <p>Password: ${password}</p>
            <p>You can also use your registered email & mobile as username.</p>
        </div>`;
        const emailContent = await ejs.renderFile(emailTemplatePath, {
            user: user?.name,
            title: subject,
            content: content
        });
        const mailOptions = {
            ...mailOption,
            to: user?.email,
            subject: subject,
            html: emailContent
        };
        await transporter.sendMail(mailOptions);

        return response(res, { user }, 'User created successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.user;

        const user = await User.findOne({
            include: [
                {
                    model: Client,
                    required: true,
                    where: {
                        id: clientId
                    }
                },
                {
                    model: UserDepartment,
                    include: [Department]
                }
            ],
            where: {
                id: { [Op.eq]: id },
                clientId: { [Op.eq]: clientId }
            }
        });

        if (!user) {
            return response(res, null, 'User not found.', 404);
        }

        return response(res, user, 'User details.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.user;

        const validator = new Validator(req.body, {
            name: 'required',
            mobile: 'required',
            email: 'required|email',
            username: 'required',
            departmentIds: 'required|array',
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'Validation error', 422);
        }

        let errors = {};
        const {
            departmentIds,
            name,
            lastName,
            countryCode,
            mobile,
            email,
            username,
            role,
            password,
            dateOfBirth,
            gender,
            primaryHand,
            address,
            city,
            country,
            postalCode,
            emergencyContactName,
            emergencyContactPhone,
            medicalConditions,
            allergies,
            notes,
            experienceLevel,
            stressLevel
        } = req.body;

        const user = await User.findOne({
            where: {
                id: { [Op.eq]: id },
                clientId: { [Op.eq]: clientId }
            }
        });

        if (!user) {
            return response(res, { message: 'User not found' }, 'error', 404);
        }

        const client = await Client.findOne({
            where: { id: clientId }
        })

        const proUserCount = await User.count({
            where: {
                clientId,
                isPro: 1,
                id: { [Op.ne]: user.id }
            }
        })

        const parallelUserCount = await User.count({
            where: {
                clientId,
                isPro: 0,
                id: { [Op.ne]: user.id }
            }
        }); 

        if (role === 'proUser' && proUserCount >= client.numberOfProUsers) {
            errors['proUserLimit'] = {
                message: 'Pro user limit reached for this client.',
                rule: 'limit'
            };
        } else if (role === 'parallelUser' && parallelUserCount >= client.numberOfUsers) {
            errors['parallelUserLimit'] = {
                message: 'Parallel user limit reached for this client.',
                rule: 'limit'
            };
        }

        if (username) {
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
        }

        if (email) {
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
        }

        if (mobile) {
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
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'Validation error', 422);
        }

        user.name = name;
        if (lastName) {
            user.lastName = lastName;
        }
        user.countryCode = countryCode;
        if (mobile) {
            user.mobile = mobile;
        }
        if (email) {
            user.email = email;
        }
        if (username) {
            user.username = username;
        }
        if (role === 'instructor') {
            user.role = 'instructor';
            user.isPro = 1;
        } else if (role === 'proUser') {
            user.role = 'user';
            user.isPro = 1;
        } else if (role === 'parallelUser') {
            user.role = 'user';
            user.isPro = 0;
        }
        if (dateOfBirth) {
            user.dateOfBirth = formatedDate(dateOfBirth);
        }
        if (gender) {
            user.gender = gender;
        }
        if (primaryHand) {
            user.primaryHand = primaryHand;
        }
        if (address) {
            user.address = address;
        }
        if (city) {
            user.city = city;
        }
        if (country) {
            user.country = country;
        }
        if (postalCode) {
            user.postalCode = postalCode;
        }
        if (emergencyContactName) {
            user.emergencyContactName = emergencyContactName;
        }
        if (emergencyContactPhone) {
            user.emergencyContactPhone = emergencyContactPhone;
        }
        if (medicalConditions) {
            user.medicalConditions = medicalConditions;
        }
        if (allergies) {
            user.allergies = allergies;
        }
        if (notes) {
            user.notes = notes;
        }
        if (experienceLevel) {
            user.experienceLevel = experienceLevel;
        }
        if (stressLevel) {
            user.stressLevel = stressLevel;
        }
        await user.save();

        await UserDepartment.destroy({
            where: {
                userId: user.id
            }
        })
        for (const departmentId of departmentIds) {
            const userDepartment = new UserDepartment();
            userDepartment.userId = user.id;
            userDepartment.departmentId = departmentId;
            await userDepartment.save();
        }

        if (password) {
            const subject = 'Your profile has been updated.';
            const content = `<div>
                <p>Your profile details have been updated successfully.</p>
                <p>Username: ${user.username}</p>
                <p>You can also use your registered email & mobile as username.</p>
            </div>`;
            const emailContent = await ejs.renderFile(emailTemplatePath, {
                user: user.name,
                title: subject,
                content: content
            });
            const mailOptions = {
                ...mailOption,
                to: user.email,
                subject: subject,
                html: emailContent
            };
            await transporter.sendMail(mailOptions);
        }

        return response(res, { user }, 'User updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const destroy = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.user;

        const user = await User.findOne({
            where: {
                id: { [Op.eq]: id },
                clientId: { [Op.eq]: clientId }
            }
        });

        if (!user) {
            return response(res, null, 'User not found.', 404);
        }

        await UserDepartment.destroy({
            where: {
                userId: user.id
            }
        });

        await user.destroy();

        return response(res, null, 'User deleted successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

module.exports = {
    index,
    store,
    show,
    update,
    destroy
};