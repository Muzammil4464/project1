import React, { useContext } from 'react';
import './FoodCard.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const FoodCard = ({ id, name, price, description, image, category, rating, isAvailable }) => {
    const {
        cartItems,
        addToCart,
        removeFromCart,
        url,
        setSelectedFood
    } = useContext(StoreContext);

    const quantity = cartItems[id] || 0;
    const imageUrl = image ? `${url}/image/${image}` : assets.header_img;

    const foodObject = {
        _id: id,
        name,
        price,
        description,
        image,
        category,
        rating,
        isAvailable
    };

    return (
        <div className={`food-card-modern ${isAvailable === false ? 'out-of-stock' : ''}`}>
            {/* Image Wrap */}
            <div
                className="food-card-image-wrap"
                onClick={() => setSelectedFood(foodObject)}
                role="button"
                tabIndex={0}
                aria-label={`View details of ${name}`}
            >
                <img
                    src={imageUrl}
                    alt={name}
                    className="food-card-img"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.header_img;
                    }}
                />

                <span className="food-card-category-tag">{category}</span>

                {isAvailable === false && (
                    <div className="out-of-stock-overlay">
                        <span>Sold Out</span>
                    </div>
                )}
            </div>

            {/* Content Details */}
            <div className="food-card-content">
                <div className="food-card-header">
                    <div className="food-card-veg-indicator" title={category === 'Salad' || category === 'Pure Veg' ? 'Vegetarian' : 'Chef Dish'}>
                        <div className={`indicator-dot ${category === 'Salad' || category === 'Pure Veg' ? 'veg' : 'non-veg'}`}></div>
                    </div>
                    <div className="food-card-rating">
                        <img src={assets.rating_starts} alt="Rating" />
                        <span>{rating || '4.5'}</span>
                    </div>
                </div>

                <h3
                    className="food-card-title"
                    onClick={() => setSelectedFood(foodObject)}
                >
                    {name}
                </h3>

                <p className="food-card-description">{description}</p>

                {/* Footer with Price & Actions */}
                <div className="food-card-footer">
                    <div className="food-card-price">
                        <span className="price-symbol">₹</span>
                        <span className="price-value">{price}</span>
                    </div>

                    {isAvailable !== false && (
                        <div className="food-card-cart-action">
                            {quantity === 0 ? (
                                <button
                                    className="food-card-add-btn"
                                    onClick={() => addToCart(id)}
                                >
                                    <span>ADD</span>
                                    <span className="add-plus">+</span>
                                </button>
                            ) : (
                                <div className="food-card-counter">
                                    <button
                                        type="button"
                                        className="counter-btn minus-btn"
                                        onClick={() => removeFromCart(id)}
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <span className="counter-value">{quantity}</span>
                                    <button
                                        type="button"
                                        className="counter-btn plus-btn"
                                        onClick={() => addToCart(id)}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodCard;