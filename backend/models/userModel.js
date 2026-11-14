const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        phone: {
            type: String,
            default: ''
        },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zipCode: { type: String, default: '' },
            country: { type: String, default: '' }
        },
        cartData: {
            type: Object,
            default: {}
        }
    },
    { minimize: false, timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
module.exports = userModel;