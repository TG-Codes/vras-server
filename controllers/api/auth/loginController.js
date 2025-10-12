// Validator
const { Validator } = require('node-input-validator');

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const moment = require('moment');

// JWT
const jwt = require('jsonwebtoken');

// Common Response
const { response } = require('../../../config/response');

// JWT Middleware - Auth
const { generateAuthToken, authentication, generateRefreshToken, verifyRefreshToken } = require('../../../config/auth');

let accessTokenSecret = 'jwtsecret';
let refreshTokenSecret = 'jwtrefreshsecret';

// nanoid - Unique Token
const nanoid = require('nanoid');
const generateUniqueCode = nanoid.customAlphabet('0123456789', 4);

// Model
const { Op } = require('sequelize');
const { User } = require('../../../models/User');
const { Client } = require('../../../models/Client');
const { Subscription } = require('../../../models/Subscription');
const { Environment } = require('../../../models/Environment');
const { Scenario } = require('../../../models/Scenario');

const login = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            username: 'required',
            password: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const {
            username,
            password
        } = req.body;

        let errors = {};
        const user = await User.findOne({
            include: [Client],
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    {
                        [Op.or]: [
                            { username: { [Op.eq]: username } },
                            { email: { [Op.eq]: username } },
                            { mobile: { [Op.eq]: username } }
                        ],
                    }
                ]
            }
        });

        if (user?.client) {
            const currentDate = moment().startOf('day');
            const endAtDate = moment(user.client.endAt).startOf('day');

            if (user.client.endAt && endAtDate.isSameOrBefore(currentDate)) {
                errors['username'] = {
                    message: 'Subscription expired. Please renew.',
                    rule: 'expired'
                };
            }

            if (user.client.status !== 'active') {
                errors['client'] = {
                    message: 'Client inactive. Contact Super-Admin.',
                    rule: 'inactive'
                };
            }
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            errors['username'] = {
                message: 'Invalid credentials.',
                rule: 'invalid'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const accessToken = generateAuthToken(user);
        const refreshToken = generateRefreshToken(user);
        user.token = accessToken;
        user.refreshToken = refreshToken;
        user.isOnline = 1;
        user.code = generateUniqueCode();
        await user.save();

        if (user.client) {
            user.client.isOnline = 1;
            await user.client.save();
        }

        return response(res, user, 'Login successful.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
};

// const refreshToken = async (req, res) => {
//     try {
//         const { refreshToken } = req.body;

//         if (!refreshToken) {
//             return response(res, {}, 'Refresh token is required.', 401);
//         }

//         jwt.verify(refreshToken, refreshTokenSecret, async (error, user) => {
//             if (error) {
//                 return response(res, {}, 'Invalid or expired refresh token.', 401);
//             }

//             const dbUser = await User.findOne({
//                 where: {
//                     id: user.id
//                 }
//             });
//             if (!dbUser) {
//                 return response(res, {}, 'User not found.', 404);
//             }

//             const newAccessToken = generateAuthToken(dbUser);
//             const newRefreshToken = generateRefreshToken(dbUser);

//             dbUser.token = newAccessToken;
//             dbUser.refreshToken = newRefreshToken;
//             await dbUser.save();

//             return response(res, { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn: 180 }, 'Token refreshed successfully.', 200);
//         });
//     } catch (error) {
//         return response(res, {}, error.message, 500);
//     }
// };

const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response(res, {}, 'Refresh token is required in Authorization header.', 401);
        }

        const refreshToken = authHeader.split(' ')[1];

        jwt.verify(refreshToken, refreshTokenSecret, async (error, user) => {
            if (error) {
                return response(res, {}, 'Invalid or expired refresh token.', 401);
            }

            const dbUser = await User.findOne({
                where: {
                    id: user.id
                }
            });

            if (!dbUser) {
                return response(res, {}, 'User not found.', 404);
            }

            const newAccessToken = generateAuthToken(dbUser);
            const newRefreshToken = generateRefreshToken(dbUser);

            dbUser.token = newAccessToken;
            dbUser.refreshToken = newRefreshToken;
            await dbUser.save();

            return response(res, { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn: 180 }, 'Token refreshed successfully.', 200);
        });
    } catch (error) {
        return response(res, {}, error.message, 500);
    }
};

const logout = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findOne({
            include: [Client],
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!user) {
            return response(res, req.body, 'User not found.', 422);
        }

        // Add the token to the blacklist
        blacklistedTokens.add(user.token);

        user.token = null;
        user.refreshToken = null;
        user.code = null;
        user.isOnline = 0;
        await user.save();

        if (user.client) {
            user.client.isOnline = 0;
            await user.client.save();
        }

        return response(res, user, 'User logout successfull.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const vrLogin = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            credential: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        const { credential } = req.body;

        const user = await User.findOne({
            where: {
                [Op.and]: [
                    { role: { [Op.ne]: 'admin' } },
                    { status: { [Op.eq]: 'active' } },
                    {
                        [Op.or]: [
                            {
                                code: {
                                    [Op.eq]: credential
                                }
                            },
                            {
                                username: {
                                    [Op.eq]: credential
                                }
                            }
                        ]
                    }
                ]
            }
        });

        if (!user) {
            return response(res, user, 'User not found.', 422);
        }

        if (user?.client) {
            const fromDate = moment().startOf('day');
            const toDate = moment(user.client.endAt).startOf('day');
            if (user.client.endAt && toDate.isSameOrBefore(fromDate)) {
                return response(res, {}, 'Subscription expired. Please renew.', 422);
            }

            if (user.client.status !== 'active') {
                return response(res, {}, 'Client inactive. Contact Super-Admin.', 422);
            }
        }

        // Set user as online for VR login
        user.isOnline = 1;
        await user.save();

        if (user.client) {
            user.client.isOnline = 1;
            await user.client.save();
        }

        return response(res, user, 'User vrlogin successfull.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    login,
    logout,
    vrLogin,
    refreshToken
};