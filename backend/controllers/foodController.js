const foodModel = require('../models/foodModel');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Food image is required.'
            });
        }

        const { name, description, price, category } = req.body;

        if (!name || !description || price === undefined || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, description, price, category) are required.'
            });
        }

        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid positive price.'
            });
        }

        const food = await foodModel.create({
            name: name.trim(),
            description: description.trim(),
            price: numericPrice,
            category: category.trim(),
            image: req.file.filename,
            isAvailable: req.body.isAvailable !== 'false' && req.body.isAvailable !== false
        });

        return res.status(201).json({
            success: true,
            message: 'Food added successfully!',
            data: food
        });
    } catch (error) {
        console.error('Add food error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while adding food item.'
        });
    }
};

const listFood = async (req, res) => {
    try {
        const { category, search, sort, availableOnly } = req.query;
        const filter = {};

        if (category && category !== 'All') {
            filter.category = new RegExp(`^${category}$`, 'i');
        }

        if (search && search.trim() !== '') {
            filter.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        if (availableOnly === 'true') {
            filter.isAvailable = true;
        }

        let query = foodModel.find(filter);

        if (sort === 'price-asc') {
            query = query.sort({ price: 1 });
        } else if (sort === 'price-desc') {
            query = query.sort({ price: -1 });
        } else if (sort === 'rating') {
            query = query.sort({ rating: -1 });
        } else {
            query = query.sort({ createdAt: -1 });
        }

        const foods = await query.exec();
        return res.status(200).json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        console.error('List food error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving food items.'
        });
    }
};

const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found.'
            });
        }
        return res.status(200).json({
            success: true,
            data: food
        });
    } catch (error) {
        console.error('Get food by id error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching food item.'
        });
    }
};

const updateFood = async (req, res) => {
    try {
        const id = req.body.id || req.params.id;
        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found.'
            });
        }

        const { name, description, price, category, isAvailable, rating } = req.body;

        if (name) food.name = name.trim();
        if (description) food.description = description.trim();
        if (price !== undefined) {
            const numPrice = Number(price);
            if (!isNaN(numPrice) && numPrice > 0) food.price = numPrice;
        }
        if (category) food.category = category.trim();
        if (isAvailable !== undefined) {
            food.isAvailable = isAvailable === 'true' || isAvailable === true;
        }
        if (rating !== undefined) {
            const numRating = Number(rating);
            if (!isNaN(numRating) && numRating >= 1 && numRating <= 5) food.rating = numRating;
        }

        if (req.file) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', food.image);
            try {
                if (fs.existsSync(oldImagePath)) {
                    await fsPromises.unlink(oldImagePath);
                }
            } catch (unlinkErr) {
                console.warn('Could not unlink old image:', unlinkErr.message);
            }
            food.image = req.file.filename;
        }

        await food.save();

        return res.status(200).json({
            success: true,
            message: 'Food item updated successfully!',
            data: food
        });
    } catch (error) {
        console.error('Update food error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating food item.'
        });
    }
};

const removeFood = async (req, res) => {
    try {
        const id = req.query.id || req.body.id || req.params.id;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Food ID is required.'
            });
        }

        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found.'
            });
        }

        if (food.image) {
            const imagePath = path.join(__dirname, '..', 'uploads', food.image);
            try {
                if (fs.existsSync(imagePath)) {
                    await fsPromises.unlink(imagePath);
                }
            } catch (unlinkErr) {
                console.warn('Could not remove image file:', unlinkErr.message);
            }
        }

        await foodModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Food item deleted successfully.'
        });
    } catch (error) {
        console.error('Remove food error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the food item.'
        });
    }
};

const seedInitialFoodsIfEmpty = async () => {
    try {
        const count = await foodModel.countDocuments();
        if (count > 0) return;

        console.log('Food collection is empty. Seeding initial dishes...');
        const sourceDir = path.join(__dirname, '..', '..', 'FoodPrep', 'src', 'assets');
        const uploadsDir = path.join(__dirname, '..', 'uploads');

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const initialDishes = [
            { name: "Greek Salad", imageFile: "food_1.png", price: 120, description: "Fresh crisp vegetables, feta cheese, and savory kalamata olives drizzled with olive oil.", category: "Salad" },
            { name: "Veg Salad", imageFile: "food_2.png", price: 140, description: "A nutrient-packed bowl of mixed garden greens, cucumbers, tomatoes, and herb dressing.", category: "Salad" },
            { name: "Clover Salad", imageFile: "food_3.png", price: 160, description: "Delicate clover sprouts, baby spinach, crisp apples, and roasted sunflower seeds.", category: "Salad" },
            { name: "Chicken Salad", imageFile: "food_4.png", price: 240, description: "Juicy grilled chicken strips tossed with crisp romaine, parmesan, and Caesar dressing.", category: "Salad" },
            { name: "Lasagna Rolls", imageFile: "food_5.png", price: 180, description: "Stuffed pasta rolls filled with creamy ricotta, mozzarella, and house-made marinara.", category: "Rolls" },
            { name: "Peri Peri Rolls", imageFile: "food_6.png", price: 160, description: "Spicy peri peri marinated fillings rolled in a soft, flaky flatbread wrap.", category: "Rolls" },
            { name: "Chicken Rolls", imageFile: "food_7.png", price: 200, description: "Tender chicken tikka chunks rolled with pickled onions and mint chutney.", category: "Rolls" },
            { name: "Veg Rolls", imageFile: "food_8.png", price: 150, description: "Crispy vegetable patties wrapped with tangy sauces and crunchy capsicum.", category: "Rolls" },
            { name: "Ripple Ice Cream", imageFile: "food_9.png", price: 140, description: "Creamy artisanal vanilla ice cream swirled with rich fudge chocolate ribbon.", category: "Deserts" },
            { name: "Fruit Ice Cream", imageFile: "food_10.png", price: 170, description: "Refreshing natural fruit gelato loaded with seasonal berries and mango chunks.", category: "Deserts" },
            { name: "Jar Ice Cream", imageFile: "food_11.png", price: 190, description: "Decadent dessert jar layered with cake crumbles, mousse, and premium ice cream.", category: "Deserts" },
            { name: "Vanilla Ice Cream", imageFile: "food_12.png", price: 120, description: "Classic Madagascar vanilla bean ice cream served chilled.", category: "Deserts" },
            { name: "Chicken Sandwich", imageFile: "food_13.png", price: 160, description: "Toasted brioche bread filled with seasoned shredded chicken and garlic aioli.", category: "Sandwich" },
            { name: "Vegan Sandwich", imageFile: "food_14.png", price: 180, description: "Wholesome avocado, hummus, sun-dried tomatoes, and greens on whole wheat.", category: "Sandwich" },
            { name: "Grilled Sandwich", imageFile: "food_15.png", price: 150, description: "Golden toasted panini loaded with cheddar cheese, corn, and bell peppers.", category: "Sandwich" },
            { name: "Bread Sandwich", imageFile: "food_16.png", price: 220, description: "Triple-layer club sandwich with crunchy vegetables and creamy spreads.", category: "Sandwich" },
            { name: "Cup Cake", imageFile: "food_17.png", price: 140, description: "Moist sponge cupcake topped with velvety vanilla buttercream swirl.", category: "Cake" },
            { name: "Vegan Cake", imageFile: "food_18.png", price: 180, description: "Plant-based rich chocolate cake made with organic cocoa and almond milk.", category: "Cake" },
            { name: "Butterscotch Cake", imageFile: "food_19.png", price: 200, description: "Caramelized crunch and smooth butterscotch cream on soft sponge layers.", category: "Cake" },
            { name: "Sliced Cake", imageFile: "food_20.png", price: 150, description: "Classic tea-time loaf slice infused with lemon zest and sweet glaze.", category: "Cake" },
            { name: "Garlic Mushroom", imageFile: "food_21.png", price: 140, description: "Button mushrooms sautéed in aromatic garlic butter and fresh parsley.", category: "Pure Veg" },
            { name: "Fried Cauliflower", imageFile: "food_22.png", price: 220, description: "Crisp batter-fried cauliflower florets tossed in sweet and spicy chili sauce.", category: "Pure Veg" },
            { name: "Mix Veg Pulao", imageFile: "food_23.png", price: 160, description: "Fragrant basmati rice cooked with whole spices, green peas, and carrots.", category: "Pure Veg" },
            { name: "Rice Zucchini", imageFile: "food_24.png", price: 180, description: "Herb-infused butter rice stir-fried with tender grilled zucchini medallions.", category: "Pure Veg" },
            { name: "Cheese Pasta", imageFile: "food_25.png", price: 180, description: "Penne pasta bathed in a luscious four-cheese Alfredo sauce.", category: "Pasta" },
            { name: "Tomato Pasta", imageFile: "food_26.png", price: 160, description: "Classic Italian arrabbiata pasta simmered with San Marzano tomatoes and basil.", category: "Pasta" },
            { name: "Creamy Pasta", imageFile: "food_27.png", price: 210, description: "Silky white sauce pasta tossed with sautéed bell peppers and broccoli florets.", category: "Pasta" },
            { name: "Chicken Pasta", imageFile: "food_28.png", price: 260, description: "Tender herb-crusted chicken strips served over rigatoni in pink blush sauce.", category: "Pasta" },
            { name: "Buttered Noodles", imageFile: "food_29.png", price: 140, description: "Silky egg noodles tossed in browned butter, garlic, and fresh chives.", category: "Noodles" },
            { name: "Veg Noodles", imageFile: "food_30.png", price: 170, description: "Wok-tossed Hakka noodles with julienned vegetables and light soy sauce.", category: "Noodles" },
            { name: "Somen Noodles", imageFile: "food_31.png", price: 200, description: "Delicate Japanese somen wheat noodles served with savory dipping sauce.", category: "Noodles" },
            { name: "Cooked Noodles", imageFile: "food_32.png", price: 190, description: "Spicy Schezwan noodles stir-fried with crisp cabbage, capsicum, and scallions.", category: "Noodles" }
        ];

        const docsToInsert = [];

        for (const item of initialDishes) {
            const srcPath = path.join(sourceDir, item.imageFile);
            let targetFilename = item.imageFile;

            if (fs.existsSync(srcPath)) {
                targetFilename = `${Date.now()}_${item.imageFile}`;
                const destPath = path.join(uploadsDir, targetFilename);
                fs.copyFileSync(srcPath, destPath);
            }

            docsToInsert.push({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                image: targetFilename,
                isAvailable: true,
                rating: 4.5
            });
        }

        await foodModel.insertMany(docsToInsert);
        console.log(`Successfully seeded ${docsToInsert.length} authentic dishes into database!`);
    } catch (seedErr) {
        console.warn('Initial seed note:', seedErr.message);
    }
};

module.exports = {
    addFood,
    listFood,
    getFoodById,
    updateFood,
    removeFood,
    seedInitialFoodsIfEmpty
};