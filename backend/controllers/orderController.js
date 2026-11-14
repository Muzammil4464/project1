const orderModel = require('../models/orderModel');
const foodModel = require('../models/foodModel');
const userModel = require('../models/userModel');

const placeOrder = async (req, res) => {
    try {
        const { items, address, paymentMethod = 'COD' } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty. Please add items before placing an order.'
            });
        }

        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Delivery address details are required.'
            });
        }

        const requiredAddressFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'phone'];
        for (const field of requiredAddressFields) {
            if (!address[field] || String(address[field]).trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: `Address field '${field}' is required.`
                });
            }
        }

        // CRITICAL SECURITY: Retrieve current product prices from database & calculate total on backend
        let subtotal = 0;
        const verifiedItems = [];

        for (const item of items) {
            const foodId = item.foodId || item._id;
            if (!foodId) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid item data in cart.'
                });
            }

            const food = await foodModel.findById(foodId);
            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: `Item '${item.name || foodId}' is no longer on the menu.`
                });
            }

            if (!food.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `Item '${food.name}' is currently out of stock.`
                });
            }

            const quantity = parseInt(item.quantity, 10);
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid quantity for item '${food.name}'.`
                });
            }

            const itemTotal = food.price * quantity;
            subtotal += itemTotal;

            verifiedItems.push({
                foodId: food._id,
                name: food.name,
                price: food.price,
                quantity,
                image: food.image,
                category: food.category
            });
        }

        const deliveryFee = 20;
        const finalAmount = subtotal + deliveryFee;

        const newOrder = await orderModel.create({
            userId: req.userId,
            items: verifiedItems,
            amount: finalAmount,
            deliveryFee,
            address: {
                firstName: address.firstName.trim(),
                lastName: address.lastName.trim(),
                email: address.email.trim(),
                street: address.street.trim(),
                city: address.city.trim(),
                state: address.state.trim(),
                zipCode: address.zipCode.trim(),
                country: (address.country || 'India').trim(),
                phone: address.phone.trim()
            },
            status: 'Order Placed',
            paymentMethod: paymentMethod === 'Online' ? 'Online' : 'COD',
            payment: paymentMethod === 'Online'
        });

        // Clear user's cart in database
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderId: newOrder._id,
            order: newOrder
        });
    } catch (error) {
        console.error('Place order error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while placing your order. Please try again.'
        });
    }
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('User orders error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve your orders.'
        });
    }
};

const allOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status && status !== 'All') {
            filter.status = status;
        }

        const orders = await orderModel.find(filter)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('All orders error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders.'
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const validStatuses = ['Order Placed', 'Food Processing', 'Out for delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        }

        order.status = status;
        if (status === 'Delivered') {
            order.payment = true;
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: `Order status updated to '${status}'.`,
            data: order
        });
    } catch (error) {
        console.error('Update status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update order status.'
        });
    }
};

const getDashboardMetrics = async (req, res) => {
    try {
        const [totalFoods, totalOrders, pendingOrders, completedOrders, cancelledOrders, revenueAgg, recentOrders] = await Promise.all([
            foodModel.countDocuments(),
            orderModel.countDocuments(),
            orderModel.countDocuments({ status: { $in: ['Order Placed', 'Food Processing', 'Out for delivery'] } }),
            orderModel.countDocuments({ status: 'Delivered' }),
            orderModel.countDocuments({ status: 'Cancelled' }),
            orderModel.aggregate([
                { $match: { status: { $ne: 'Cancelled' } } },
                { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
            ]),
            orderModel.find({}).sort({ createdAt: -1 }).limit(5)
        ]);

        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

        return res.status(200).json({
            success: true,
            metrics: {
                totalFoods,
                totalOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Dashboard metrics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to compute dashboard metrics.'
        });
    }
};

module.exports = {
    placeOrder,
    userOrders,
    allOrders,
    updateStatus,
    getDashboardMetrics
};
