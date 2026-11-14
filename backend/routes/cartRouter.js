const express = require('express');
const cartRouter = express.Router();
const {
    addToCart,
    removeFromCart,
    getCart,
    clearCart
} = require('../controllers/cartController');
const { authMiddleware } = require('../middlewares/auth');

cartRouter.post('/add', authMiddleware, addToCart);
cartRouter.post('/remove', authMiddleware, removeFromCart);
cartRouter.get('/get', authMiddleware, getCart);
cartRouter.post('/clear', authMiddleware, clearCart);

module.exports = cartRouter;
