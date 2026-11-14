const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        items: [
            {
                foodId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'food'
                },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true, min: 1 },
                image: { type: String },
                category: { type: String }
            }
        ],
        amount: {
            type: Number,
            required: true
        },
        deliveryFee: {
            type: Number,
            default: 20
        },
        address: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true }
        },
        status: {
            type: String,
            enum: ['Order Placed', 'Food Processing', 'Out for delivery', 'Delivered', 'Cancelled'],
            default: 'Order Placed'
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'Online'],
            default: 'COD'
        },
        payment: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

module.exports = orderModel;
