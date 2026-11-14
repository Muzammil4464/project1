const express = require('express');
const userRouter = express.Router();
const {
    loginUser,
    registerUser,
    adminLogin,
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/auth');

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin-login', adminLogin);
userRouter.get('/profile', authMiddleware, getUserProfile);
userRouter.post('/update-profile', authMiddleware, updateUserProfile);

module.exports = userRouter;
