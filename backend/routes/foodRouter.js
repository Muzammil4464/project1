const express = require('express');
const foodRouter = express.Router();
const {
    addFood,
    listFood,
    getFoodById,
    updateFood,
    removeFood
} = require('../controllers/foodController');
const multer = require('multer');
const path = require('path');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

// Image storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e4)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed!'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter
});

foodRouter.get('/list', listFood);
foodRouter.get('/item/:id', getFoodById);
foodRouter.post('/add', authMiddleware, adminMiddleware, upload.single('image'), addFood);
foodRouter.post('/update', authMiddleware, adminMiddleware, upload.single('image'), updateFood);
foodRouter.delete('/remove', authMiddleware, adminMiddleware, removeFood);

module.exports = foodRouter;