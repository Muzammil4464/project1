require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/dbConn');
const { ensureDefaultAdmin } = require('./controllers/userController');
const { seedInitialFoodsIfEmpty } = require('./controllers/foodController');

const app = express();
const port = process.env.PORT || 4000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://project1-zu0w.onrender.com'
];

if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);
if (process.env.ADMIN_URL) allowedOrigins.push(process.env.ADMIN_URL);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or from allowed origins
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        return callback(null, true); // Permissive in development, can restrict in strict production
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Static files for uploaded food images
app.use('/image', express.static(path.join(__dirname, 'uploads')));

// Connect database and run initializers
connectDB().then(async () => {
    await ensureDefaultAdmin();
    await seedInitialFoodsIfEmpty();
}).catch(err => {
    console.error('Database initialization note:', err.message);
});

// API Routes
app.use('/api/food', require('./routes/foodRouter'));
app.use('/api/user', require('./routes/userRouter'));
app.use('/api/cart', require('./routes/cartRouter'));
app.use('/api/order', require('./routes/orderRouter'));

// Root / Health check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'FoodPrep API is running smoothly',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    if (res.headersSent) {
        return next(err);
    }
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || 'An unexpected internal server error occurred.'
    });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`FoodPrep server started on port ${port}`);
    });
}

module.exports = app;
