const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Food name is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0
        },
        image: {
            type: String,
            required: [true, 'Image filename is required']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        rating: {
            type: Number,
            default: 4.5,
            min: 1,
            max: 5
        }
    },
    { timestamps: true }
);

const foodModel = mongoose.models.food || mongoose.model('food', foodSchema);

module.exports = foodModel;