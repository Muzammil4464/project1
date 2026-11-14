const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { getJwtSecret } = require('../middlewares/auth');

const createToken = (id, role = 'user') => {
    return jwt.sign(
        { id, role },
        getJwtSecret(),
        { expiresIn: '7d' }
    );
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, email, password) are required.'
            });
        }

        const trimmedEmail = email.trim().toLowerCase();

        if (!validator.isEmail(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long.'
            });
        }

        const exists = await userModel.findOne({ email: trimmedEmail });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists. Please log in.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name: name.trim(),
            email: trimmedEmail,
            password: hashedPassword,
            role: 'user'
        });

        const token = createToken(user._id, user.role);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during registration. Please try again.'
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        const trimmedEmail = email.trim().toLowerCase();
        const user = await userModel.findOne({ email: trimmedEmail });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const token = createToken(user._id, user.role);

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during login. Please try again.'
        });
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        const trimmedEmail = email.trim().toLowerCase();
        const user = await userModel.findOne({ email: trimmedEmail });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid administrator credentials.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid administrator credentials.'
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You do not have administrator permissions.'
            });
        }

        const token = createToken(user._id, user.role);

        return res.status(200).json({
            success: true,
            message: 'Admin authentication successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during admin authentication.'
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found.'
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile.'
        });
    }
};

const updateUserProfile = async (req, res) => {
    const { name, phone, address } = req.body;

    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        if (name) user.name = name.trim();
        if (phone !== undefined) user.phone = phone.trim();
        if (address) {
            user.address = {
                ...user.address,
                ...address
            };
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update profile.'
        });
    }
};

const ensureDefaultAdmin = async () => {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@foodprep.com').trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

        const existingAdmin = await userModel.findOne({
            $or: [{ role: 'admin' }, { email: adminEmail }]
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await userModel.create({
                name: 'FoodPrep Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log(`Default administrator account initialized for: ${adminEmail}`);
        } else if (existingAdmin.role !== 'admin') {
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log(`Upgraded existing user ${existingAdmin.email} to admin role.`);
        }
    } catch (err) {
        console.error('Admin initialization note:', err.message);
    }
};

module.exports = {
    loginUser,
    registerUser,
    adminLogin,
    getUserProfile,
    updateUserProfile,
    ensureDefaultAdmin
};