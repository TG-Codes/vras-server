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
const { Department } = require('../../../models/Department');
const { UserDepartment } = require('../../../models/UserDepartment');

const index = async (req, res) => {
    try {
        const { page = 1, length = 10, isOnline } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(length);

        const whereCondition = {
            // status: 'active',
        };

        if (isOnline) {
            whereCondition.isOnline = parseInt(isOnline);
        }

        const { count: total, rows: clients } = await Client.findAndCountAll({
            include: [
                { model: Subscription },
                { model: Environment },
                { model: Scenario },
                { model: Department },
                { model: User }
            ],
            where: whereCondition,
            order: [
                ['id', 'DESC']
            ],
            limit: parseInt(length),
            offset: offset,
            distinct: true,
        });

        return response(res, { clients, total }, 'Clients list retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const store = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            subscriptionId: 'required',
            environmentId: 'integer',
            scenarioIds: 'array',
            slug: 'required',
            name: 'required',
            mobile: 'required',
            email: 'required|email',
            username: 'required',
            password: 'required',
            confirmPassword: 'required|same:password'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            subscriptionId,
            environmentId,
            scenarioIds = [],
            numberOfUsers,
            numberOfProUsers,
            slug,
            name,
            countryCode,
            mobile,
            contactName,
            contactEmail,
            contactCountryCode,
            contactMobile,
            email,
            username,
            password,
            dateOfBirth,
            gender,
            address,
            city,
            country,
            postalCode,
            startAt,
            endAt,
            notes,
            // primaryHand,
            // emergencyContactName,
            // emergencyContactPhone,
            // medicalConditions,
            // allergies,
        } = req.body;

        const slugCount = await Client.count({
            where: {
                slug: { [Op.eq]: slug }
            }
        });
        if (slugCount > 0) {
            errors['slug'] = {
                message: 'The slug already exists.',
                rule: 'unique'
            };
        }

        const nameCount = await Client.count({
            where: {
                name: { [Op.eq]: name }
            }
        });
        if (nameCount > 0) {
            errors['name'] = {
                message: 'The name already exists.',
                rule: 'unique'
            };
        }

        const usernameCount = await User.count({
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    { username: { [Op.eq]: username } }
                ]
            }
        });
        if (usernameCount > 0) {
            errors['username'] = {
                message: 'The username already exists.',
                rule: 'unique'
            };
        }

        const emailCount = await Client.count({
            where: {
                email: { [Op.eq]: email }
            }
        });
        const userEmailCount = await User.count({
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    { email: { [Op.eq]: email } }
                ]
            }
        });
        if (emailCount > 0 || userEmailCount > 0) {
            errors['email'] = {
                message: 'The email already exists.',
                rule: 'unique'
            };
        }

        const mobileCount = await Client.count({
            where: {
                mobile: { [Op.eq]: mobile }
            }
        });
        const userMobileCount = await User.count({
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    { mobile: { [Op.eq]: mobile } }
                ]
            }
        });
        if (mobileCount > 0 || userMobileCount > 0) {
            errors['mobile'] = {
                message: 'The mobile already exists.',
                rule: 'unique'
            };
        }

        if (Object.keys(errors).length > 0) {
            return response(res, errors, 'validation', 422);
        }

        const subscription = await Subscription.findOne({
            where: {
                id: { [Op.eq]: subscriptionId }
            }
        });

        if (!subscription) {
            return response(res, {}, 'Subscription not found.', 404);
        }

        let environment = null;
        if (environmentId) {
            environment = await Environment.findOne({
                where: {
                    id: { [Op.eq]: environmentId }
                }
            });

            if (!environment) {
                return response(res, {}, 'Environment not found.', 404);
            }
        }

        const client = new Client();
        client.subscriptionId = subscriptionId;
        client.environmentId = environmentId;
        client.slug = slug;
        client.name = name;
        client.email = email;
        client.countryCode = countryCode;
        client.mobile = mobile;
        client.contactName = contactName;
        client.contactEmail = contactEmail;
        client.contactCountryCode = contactCountryCode;
        client.contactMobile = contactMobile;
        if (numberOfProUsers) {
            client.numberOfProUsers = numberOfProUsers;
        }
        if (numberOfUsers) {
            client.numberOfUsers = numberOfUsers;
        }
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
        if (startAt) {
            client.startAt = formatedDate(startAt);
        }
        if (endAt) {
            client.endAt = formatedDate(endAt);
        }
        client.payStatus = 'initiate';
        client.status = 'inactive';
        if (notes) {
            client.notes = notes;
        }
        await client.save();

        if (scenarioIds && scenarioIds.length > 0) {
            for (const scenarioId of scenarioIds) {
                const scenario = new ClientScenario();
                scenario.clientId = client.id;
                scenario.environmentId = client.environmentId;
                scenario.scenarioId = scenarioId;
                await scenario.save();
            }
        }

        const user = new User();
        user.clientId = client?.id;
        user.name = name;
        user.countryCode = countryCode;
        user.mobile = mobile;
        user.email = email;
        user.username = username;
        user.password = bcrypt.hashSync(password, salt); // generate a hash
        user.role = 'client';
        if (dateOfBirth) {
            user.dateOfBirth = formatedDate(dateOfBirth);
        }
        if (gender) {
            user.gender = gender;
        }
        // if (primaryHand) {
        //     user.primaryHand = primaryHand;
        // }
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
        // if (emergencyContactName) {
        //     user.emergencyContactName = emergencyContactName;
        // }
        // if (emergencyContactPhone) {
        //     user.emergencyContactPhone = emergencyContactPhone;
        // }
        // if (medicalConditions) {
        //     user.medicalConditions = medicalConditions;
        // }
        // if (allergies) {
        //     user.allergies = allergies;
        // }
        user.status = 'inactive';
        // user.isPro = 1;
        await user.save();

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

        return response(res, client, 'Client saved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findOne({
            include: [
                Subscription,
                Environment,
                Scenario,
                Department,
                User
            ],
            where: {
                id: { [Op.eq]: id }
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
            subscriptionId: 'required',
            environmentId: 'integer',
            scenarioIds: 'array',
            name: 'required',
            email: 'required|email',
            mobile: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const { id } = req.params;
        const {
            subscriptionId,
            environmentId,
            scenarioIds = [],
            numberOfUsers,
            numberOfProUsers,
            name,
            email,
            countryCode,
            mobile,
            contactName,
            contactEmail,
            contactCountryCode,
            contactMobile,
            address,
            city,
            country,
            postalCode,
            startAt,
            endAt,
            payStatus,
            status,
            notes
        } = req.body;

        const nameCount = await Client.count({
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

        const emailCount = await Client.count({
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

        const mobileCount = await Client.count({
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
            return response(res, errors, 'validation', 422);
        }

        const client = await Client.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!client) {
            return response(res, client, 'Client not found.', 404);
        }

        client.subscriptionId = subscriptionId;
        client.environmentId = environmentId;
        client.numberOfUsers = numberOfUsers;
        client.numberOfProUsers = numberOfProUsers;
        client.name = name;
        client.email = email;
        client.countryCode = countryCode
        client.mobile = mobile;
        client.contactName = contactName;
        client.contactEmail = contactEmail;
        client.contactCountryCode = contactCountryCode;
        client.contactMobile = contactMobile;
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
        if (startAt) {
            client.startAt = formatedDate(startAt);
        }
        if (endAt) {
            client.endAt = formatedDate(endAt);
        }
        if (payStatus) {
            client.payStatus = payStatus;
        }
        if (status) {
            client.status = status;
        }
        if (notes) {
            client.notes = notes;
        }
        await client.save();

        if (scenarioIds && scenarioIds.length > 0) {
            await ClientScenario.destroy({ where: { clientId: id } });

            for (const scenarioId of scenarioIds) {
                await ClientScenario.create({
                    clientId: client.id,
                    environmentId: client.environmentId,
                    scenarioId: scenarioId
                });
            }
        }

        return response(res, client, 'Client updated successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const client = await Client.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!client) {
            return response(res, client, 'Client not found.', 404);
        }

        await User.destroy({
            where: {
                clientId: client.id
            }
        });

        // await Department.destroy({
        //     where: {
        //       clientId: client.id
        //     }
        //   });

        //   await ClientScenario.destroy({
        //     where: {
        //       clientId: client.id
        //     }
        //   });

        await client.destroy();

        return response(res, client, 'Client deleted successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

// const changeStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const {
//             status,
//             startAt,
//             endAt,
//             numberOfProUsers,
//             numberOfUsers,
//             // environmentId,
//             // scenarioIds
//         } = req.body;

//         const client = await Client.findOne({
//             where: {
//                 id: { [Op.eq]: id }
//             }
//         });
//         if (!client) {
//             return response(res, client, 'Client not found.', 404);
//         }

//         const currentDate = new Date();
//         const formattedEndAt = new Date(endAt);

//         if (formattedEndAt <= currentDate && client.status === 'active') {
//             client.status = 'inactive';
//             client.payStatus = 'due';
//             await client.save();
//             return response(res, client, 'Subscription has expired.', 200);
//         }

//         if (status === 'active' && formattedEndAt <= currentDate) {
//             return response(res, null, 'End date must be in the future.', 400);
//         }

//         client.status = status;
//         client.payStatus = status === 'active' ? 'paid' : 'due';

//         if (status === 'active') {
//             const formattedStartAt = formatedDate(startAt);
//             client.startAt = formattedStartAt;
//             const formattedEndAt = formatedDate(endAt);
//             client.endAt = formattedEndAt;
//             client.numberOfProUsers = numberOfProUsers;
//             client.numberOfUsers = numberOfUsers;
//             // client.environmentId = environmentId;
//         }
//         await client.save();

//         // if (status === 'active') {
//         //     await ClientScenario.destroy({
//         //         where: {
//         //             clientId: client?.id
//         //         }
//         //     });

//         //     for (const scenarioId of scenarioIds) {
//         //         const scenario = new ClientScenario();
//         //         scenario.clientId = client.id;
//         //         scenario.environmentId = client.environmentId;
//         //         scenario.scenarioId = scenarioId;
//         //         await scenario.save();
//         //     }
//         // }
//         const userUpdate = {
//             status: status === 'active' ? 'active' : 'inactive'
//         };
//         await User.update(userUpdate, {
//             where: {
//                 clientId: client.id
//             }
//         });

//         if (status === 'active') {
//             const user = await User.findOne({ where: { clientId: client.id } });
//             if (user) {
//                 const subject = 'Your account has been approved.';
//                 const content = `<div><p>Congratulations! Your account has been approved.</p></div>`;
//                 try {
//                     const emailContent = await ejs.renderFile(emailTemplatePath, {
//                         user: user.name,
//                         title: subject,
//                         content
//                     });
//                     const mailOptions = {
//                         ...mailOption,
//                         to: user.email,
//                         subject,
//                         html: emailContent
//                     };
//                     await transporter.sendMail(mailOptions);
//                 } catch (emailError) {
//                     console.error('Email sending failed:', emailError);
//                 }
//             }
//         }

//         return response(res, client, `Client ${status} successful.`, 200);
//     } catch (error) {
//         return response(res, req.body, error.message, 500);
//     }
// }

const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            status,
            startAt,
            endAt,
            numberOfProUsers,
            numberOfUsers,
        } = req.body;

        const client = await Client.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!client) {
            return response(res, null, 'Client not found.', 404);
        }

        const currentDate = new Date();
        const existingEndAt = new Date(client.endAt);
        const newEndAt = new Date(endAt);

        if (existingEndAt <= currentDate && client.status === 'active') {
            client.status = 'inactive';
            client.payStatus = 'due';
            await client.save();
            return response(res, client, 'Subscription has expired.', 200);
        }

        if (status === 'active' && newEndAt <= currentDate) {
            return response(res, null, 'End date must be in the future.', 400);
        }


        client.status = status;
        client.payStatus = status === 'active' ? 'paid' : 'due';

        if (status === 'active') {
            const formattedStartAt = formatedDate(startAt);
            client.startAt = formattedStartAt;
            client.endAt = formatedDate(endAt);
            client.numberOfProUsers = numberOfProUsers;
            client.numberOfUsers = numberOfUsers;
        }
        await client.save();

        const userUpdate = {
            status: status === 'active' ? 'active' : 'inactive'
        };
        await User.update(userUpdate, {
            where: {
                clientId: client.id
            }
        });

        if (status === 'active') {
            const user = await User.findOne({ where: { clientId: client.id } });
            if (user) {
                const subject = 'Your account has been approved.';
                const content = `<div><p>Congratulations! Your account has been approved.</p></div>`;
                try {
                    const emailContent = await ejs.renderFile(emailTemplatePath, {
                        user: user.name,
                        title: subject,
                        content
                    });
                    const mailOptions = {
                        ...mailOption,
                        to: user.email,
                        subject,
                        html: emailContent
                    };
                    await transporter.sendMail(mailOptions);
                } catch (emailError) {
                    console.error('Email sending failed:', emailError);
                }
            }
        }

        return response(res, client, `Client ${status} successful.`, 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};


const getScenariosByEnvironmentId = async (req, res) => {
    try {
        const {
            environmentId
        } = req.params;
        if (!environmentId) {
            return response(res, null, 'Environment ID is required.', 404);
        }

        const scenarios = await Scenario.findAll({
            include: [{
                model: Environment,
                where: {
                    id: { [Op.eq]: environmentId }
                }
            }]
        });

        return response(res, scenarios, 'Scenarios retrieved successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
}

const totalProUser = async (req, res) => {
    try {
        const { page = 1, length = 10, isPro = 1, isOnline, keywords } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(length);

        const whereCondition = {
            status: 'active',
            role: 'user',
            isPro: parseInt(isPro),
        };

        if (isOnline) {
            whereCondition.isOnline = parseInt(isOnline);
        }

        if (keywords) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${keywords}%` } }
            ];
        }

        const { count: total, rows: users } = await User.findAndCountAll({
            where: whereCondition,
            order: [
                ['id', 'DESC']
            ],
            limit: parseInt(length),
            offset: offset
        });

        return response(res, { users, total }, 'Pro users list retrieved successfully.', 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

// clients pro Users
const listProUsers = async (req, res) => {
    try {
        const { 
            page = 1, 
            length = 10, 
            isPro = 1, 
            isOnline, 
            keywords, 
            sortBy = 'id', 
            sortOrder = 'DESC' 
        } = req.query;
        const {
            clientId
        } = req.params;

        const offset = (parseInt(page) - 1) * parseInt(length);

        const whereCondition = {
            role: 'user',
            clientId: clientId,
            isPro: parseInt(isPro),
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
        let orderClause = [['id', sortOrder]];
        if (sortBy === 'isOnline') {
            orderClause = [['isOnline', sortOrder], ['updatedAt', 'DESC']];
        } else if (sortBy === 'lastActivity') {
            orderClause = [['updatedAt', sortOrder]];
        } else if (sortBy === 'name') {
            orderClause = [['name', sortOrder]];
        } else if (sortBy === 'status') {
            orderClause = [['status', sortOrder]];
        }

        const { count: total, rows: users } = await User.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'name', 'status', 'isOnline'],
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

        // Add comprehensive online status information
        const usersWithOnlineStatus = users.map(user => {
            const userData = user.toJSON();
            userData.onlineStatus = {
                isOnline: userData.isOnline === 1,
                statusText: userData.isOnline === 1 ? 'Online' : 'Offline',
                statusColor: userData.isOnline === 1 ? 'green' : 'gray',
                statusIcon: userData.isOnline === 1 ? '🟢' : '⚪',
                lastActivity: userData.updatedAt,
                clientOnline: userData.client?.isOnline === 1,
                clientStatus: userData.client?.status || 'N/A'
            };
            
            // Add department information
            userData.departments = userData.userDepartments?.map(ud => ud.department) || [];
            delete userData.userDepartments;
            
            return userData;
        });

        // Get online statistics for this client
        const onlineStats = {
            totalOnline: usersWithOnlineStatus.filter(u => u.isOnline === 1).length,
            totalOffline: usersWithOnlineStatus.filter(u => u.isOnline === 0).length,
            totalUsers: usersWithOnlineStatus.length,
            onlinePercentage: usersWithOnlineStatus.length > 0 ? 
                Math.round((usersWithOnlineStatus.filter(u => u.isOnline === 1).length / usersWithOnlineStatus.length) * 100) : 0
        };

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
                sortBy,
                sortOrder
            }
        }, 'Pro users list with online status retrieved successfully.', 200);
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

// List clientId and departments id  Wise Pro User for a clients
const listDepartmentsProUser = async (req, res) => {
    try {
        const {
            id: clientId,
            departmentId
        } = req.params;
        const userDepartments = await UserDepartment.findAll({
            where: {
                departmentId: {
                    [Op.eq]: departmentId
                },
            },
            include: [{
                model: User,
                where: {
                    clientId: clientId,
                    isPro: 1
                },
            }]
        });

        return response(res, userDepartments, 'userDepartments with pro users retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

// List  pro users id-wise departments for a client
const listProUsersDepartments = async (req, res) => {
    try {
        const {
            id: clientId,
            userId
        } = req.params;

        const users = await User.findAll({
            where: {
                id: { [Op.eq]: userId },
                isPro: 1,
                clientId: clientId
            },
            include: [{
                model: Department
            }]
        });

        return response(res, users, 'Pro users with departments retrieved successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

const scenariosList = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { page = 1, length = 10, keywords } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(length);

        const client = await Client.findOne({
            where: {
                id: { [Op.eq]: clientId }
            }
        });

        if (!client) {
            return response(res, {}, 'Client not found.', 404);
        }

        const scenarioIncludeCondition = {
            model: Scenario,
            where: {},
        };

        if (keywords) {
            scenarioIncludeCondition.where.name = {
                [Op.like]: `%${keywords}%`
            };
        }

        const { count: total, rows: scenarios } = await ClientScenario.findAndCountAll({
            where: {
                clientId: { [Op.eq]: clientId }
            },
            include: scenarioIncludeCondition,
            limit: parseInt(length),
            offset: offset,
            order: [['id', 'DESC']],
        });

        return response(res, { scenarios, total }, 'Scenarios retrieved successfully.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

const departmentList = async (req, res) => {
    try {
        const {
            clientId
        } = req.params;

        const { page = 1, length = 10, keywords } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(length);

        const whereCondition = {
            clientId: clientId,
        };

        if (keywords) {
            whereCondition.name = {
                [Op.like]: `%${keywords}%`
            };
        }

        const { count: total, rows: departments } = await Department.findAndCountAll({
            where: whereCondition,
            limit: parseInt(length),
            offset: offset,
            order: [
                ['id', 'DESC']
            ],
        });

        return response(res, { departments, total }, 'Departments retrieved successfully.', 200);
    } catch (error) {
        return response(res, null, error.message, 500);
    }
};

module.exports = {
    index,
    store,
    show,
    update,
    destroy,
    changeStatus,
    getScenariosByEnvironmentId,
    totalProUser,
    listProUsers,
    listDepartmentsProUser,
    listProUsersDepartments,
    scenariosList,
    departmentList
};