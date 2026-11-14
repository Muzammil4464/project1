const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const getJwtSecret = () => {
    return process.env.JWT_TOKEN_SECRET || process.env.JWT_SECRET || 'foodprep_jwt_secret_key_2026';
};

const authMiddleware = async (req, res, next) => {
    try {
        let token = req.headers.token || req.headers.authorization;

        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7).trim();
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in.'
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, getJwtSecret());
        } catch (jwtErr) {
            if (jwtErr.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Your session has expired. Please log in again.'
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization token. Please log in again.'
            });
        }

        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User account not found. Please register or log in.'
            });
        }

        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Authentication error occurred.'
        });
    }
};

const adminMiddleware = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Administrator privileges required.'
        });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware, getJwtSecret };
