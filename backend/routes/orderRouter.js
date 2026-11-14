const express = require('express');
const orderRouter = express.Router();
const {
    placeOrder,
    userOrders,
    allOrders,
    updateStatus,
    getDashboardMetrics
} = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.get('/userorders', authMiddleware, userOrders);
orderRouter.get('/list', authMiddleware, adminMiddleware, allOrders);
orderRouter.post('/status', authMiddleware, adminMiddleware, updateStatus);
orderRouter.get('/metrics', authMiddleware, adminMiddleware, getDashboardMetrics);

module.exports = orderRouter;
