// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Common Response
const { response } = require('../../../../config/response');

// JWT Middleware - Auth
const { generateAuthToken, authentication, generateRefreshToken } = require('../../../../config/auth');

// Model
const { Op } = require('sequelize');
const { User } = require('../../../../models/User');

const accessTokenSecret = 'jwtsecret';
const refreshTokenSecret = 'jwtrefreshsecret';
const refreshTokens = new Set(); 

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

        let errors = {};
        const {
            username,
            password
        } = req.body;

        const user = await User.findOne({
            where: {
                [Op.and]: [
                    { role: { [Op.eq]: 'admin' } },
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
        if (!user || !(await bcrypt.compare(password, user?.password))) {
            errors['username'] = {
                message: 'Invalid credentials.',
                rule: 'same'
            };
        }

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        const accessToken = generateAuthToken(user);
        const refreshToken = generateRefreshToken(user);
        user.token = accessToken; // Token to login
        user.refreshToken = refreshToken; 
        await user.save();
        
        return response(res, user, 'Admin login successfull.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

const refreshToken = async (req, res) => {
    const header = req?.headers?.authorization;
    if (!header) {
        return response(res, req.body, 'Missing refresh token.', 401);
    }

    const token = header.includes(' ') ? header.split(' ')[1] : header;

    jwt.verify(token, refreshTokenSecret, async (error, user) => {
        if (error) {
            return response(res, req.body, 'Invalid or expired refresh token.', 403);
        }

        const storedUser = await User.findOne({
            where: {
                id: user.id,
                refreshToken: token
            }
        });
        if (!storedUser) {
            return response(res, req.body, 'Invalid or expired refresh token.', 403);
        }

        const newAccessToken = generateAuthToken(user);
        return response(res, { accessToken: newAccessToken }, 'Token refreshed successfully.', 200);
    });
};

const logout = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findOne({
            where: {
                id: { [Op.eq]: id }
            }
        });
        if (!user) {
            return response(res, req.body, 'Admin not found.', 422);
        }

        // Add the token to the blacklist
        blacklistedTokens.add(user.token);

        user.token = null;
        user.refreshToken = null;
        await user.save();

        return response(res, user, 'Admin logout successfull.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    login,
    logout,
    refreshToken
};