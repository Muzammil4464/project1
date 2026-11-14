const mongoose = require('mongoose');

const connectDB = async () => {
    const primaryUri = process.env.DB_URI || process.env.MONGODB_URI;
    const fallbackUri = 'mongodb://127.0.0.1:27017/foodprep';

    if (primaryUri) {
        try {
            await mongoose.connect(primaryUri, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log('MongoDB connected successfully via environment URI.');
            return;
        } catch (err) {
            console.warn(`Primary MongoDB connection failed (${err.message}). Attempting fallback to local MongoDB...`);
        }
    }

    try {
        await mongoose.connect(fallbackUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`Connected to local MongoDB instance: ${fallbackUri}`);
    } catch (fallbackErr) {
        console.error('All MongoDB connection attempts failed:', fallbackErr.message);
        throw fallbackErr;
    }
};

module.exports = connectDB;