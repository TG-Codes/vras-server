// JWT
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'jwtsecret';
const refreshTokenSecret = 'jwtrefreshsecret';

// Common Response
const { response } = require('./response');

const generateAuthToken = ({ id, clientId, role, permissions, name, username, email, mobile }) => {
    return jwt.sign({ id, clientId, role, permissions, name, username, email, mobile },
        
        accessTokenSecret,
        // { expiresIn: process.env.EXPIRES_IN || '3m' }
    );
}

const generateRefreshToken = ({ id, clientId, role, permissions, name, username, email, mobile }) => {
    return jwt.sign({ id, clientId, role, permissions, name, username, email, mobile },
        refreshTokenSecret,
        // { expiresIn: process.env.EXPIRES_IN || '3m' }
    );
};

const verifyRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, refreshTokenSecret);
};

const authentication = (req, res, next) => {
    const header = req?.headers?.authorization;
    if (!header) {
        return response(res, req.body, 'Missing authorization token.', 401);
    }
    const token = header.includes(' ') ? header.split(' ')[1] : header;

    // Check if the token is blacklisted
    if (blacklistedTokens.has(token)) {
        return response(res, req.body, 'Expired authorization token.', 401);
    }

    jwt.verify(token, accessTokenSecret, (error, user) => {
        try {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    return response(res, req.body, 'Expired authorization token.', 401);
                } else if (error.name === 'JsonWebTokenError') {
                    return response(res, req.body, 'Invalid authorization token.', 403);
                } else {
                    return response(res, req.body, 'Unauthorized.', 403);
                }
            }

            req.user = user;
            next();
        } catch (error) {
            return response(res, req.body, error.message, 500);
        }
    });
}

const roleAuthorization = (roleString) => (req, res, next) => {
    const { role } = req.user;

    if (!role || role !== roleString) {
        return response(res, req.body, 'Access forbidden.', 403);
    }

    next();
}

module.exports = {
    generateAuthToken,
    authentication,
    roleAuthorization,
    generateRefreshToken,
    verifyRefreshToken
};