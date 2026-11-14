import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './FoodDetailModal.css';

const FoodDetailModal = () => {
    const { selectedFood, setSelectedFood, addToCart, url } = useContext(StoreContext);
    const [quantity, setQuantity] = useState(1);

    if (!selectedFood) return null;

    const handleAddToCart = () => {
        addToCart(selectedFood._id, quantity);
        setSelectedFood(null);
    };

    const imageUrl = selectedFood.image
        ? `${url}/image/${selectedFood.image}`
        : assets.header_img;

    return (
        <div className="food-detail-overlay" onClick={() => setSelectedFood(null)}>
            <div className="food-detail-container" onClick={(e) => e.stopPropagation()}>
                <button
                    className="food-detail-close"
                    onClick={() => setSelectedFood(null)}
                    aria-label="Close"
                >
                    <img src={assets.cross_icon} alt="Close" />
                </button>

                <div className="food-detail-image-wrap">
                    <img
                        src={imageUrl}
                        alt={selectedFood.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.header_img;
                        }}
                    />
                    <span className="food-detail-badge">{selectedFood.category}</span>
                </div>

                <div className="food-detail-info">
                    <div className="food-detail-header">
                        <h2>{selectedFood.name}</h2>
                        <div className="food-detail-rating">
                            <img src={assets.rating_starts} alt="Rating" />
                            <span>({selectedFood.rating || '4.5'})</span>
                        </div>
                    </div>

                    <p className="food-detail-desc">{selectedFood.description}</p>

                    <div className="food-detail-price-row">
                        <div className="food-detail-price">
                            <span className="currency">₹</span>
                            <span className="amount">{selectedFood.price}</span>
                        </div>
                        <div className="food-detail-availability">
                            <span className={`status-dot ${selectedFood.isAvailable !== false ? 'available' : 'unavailable'}`}></span>
                            <span>{selectedFood.isAvailable !== false ? 'In Stock & Fresh' : 'Currently Unavailable'}</span>
                        </div>
                    </div>

                    {selectedFood.isAvailable !== false && (
                        <div className="food-detail-actions">
                            <div className="detail-quantity-stepper">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                            </div>

                            <button className="detail-add-cart-btn" onClick={handleAddToCart}>
                                Add to Cart • ₹{selectedFood.price * quantity}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodDetailModal;
