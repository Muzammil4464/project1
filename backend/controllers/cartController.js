const userModel = require('../models/userModel');

const addToCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) {
            return res.status(400).json({ success: false, message: 'Item ID is required.' });
        }

        const userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const cartData = { ...(userData.cartData || {}) };
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(req.userId, { cartData });
        return res.status(200).json({
            success: true,
            message: 'Item added to cart.',
            cartData
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update cart.' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) {
            return res.status(400).json({ success: false, message: 'Item ID is required.' });
        }

        const userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const cartData = { ...(userData.cartData || {}) };
        if (cartData[itemId] && cartData[itemId] > 1) {
            cartData[itemId] -= 1;
        } else {
            delete cartData[itemId];
        }

        await userModel.findByIdAndUpdate(req.userId, { cartData });
        return res.status(200).json({
            success: true,
            message: 'Item removed from cart.',
            cartData
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update cart.' });
    }
};

const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            cartData: userData.cartData || {}
        });
    } catch (error) {
        console.error('Get cart error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve cart.' });
    }
};

const clearCart = async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully.'
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        return res.status(500).json({ success: false, message: 'Failed to clear cart.' });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCart,
    clearCart
};
