import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './Cart.css';

const Cart = () => {
    const {
        cartItems,
        food_list,
        removeFromCart,
        addToCart,
        clearCart,
        getTotalCartAmount,
        url,
        addToast
    } = useContext(StoreContext);

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoApplied, setPromoApplied] = useState(false);
    const navigate = useNavigate();

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 0 ? 20 : 0;
    const platformFee = subtotal > 0 ? 5 : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee + platformFee - discount);

    // Filter items in cart
    const itemsInCart = food_list.filter((food) => (cartItems[food._id] || 0) > 0);

    const handleApplyPromo = (e) => {
        e.preventDefault();
        const code = promoCode.trim().toUpperCase();

        if (promoApplied) {
            addToast('Promo code is already applied.', 'warning');
            return;
        }

        if (code === 'FOODPREP20' || code === 'WELCOME20') {
            const disc = Math.round(subtotal * 0.2);
            setDiscount(disc);
            setPromoApplied(true);
            addToast(`Promo ${code} applied! You saved ₹${disc}`, 'success');
        } else if (code === 'FLAT50') {
            if (subtotal < 200) {
                addToast('FLAT50 requires a minimum order of ₹200.', 'warning');
                return;
            }
            setDiscount(50);
            setPromoApplied(true);
            addToast('Promo FLAT50 applied! ₹50 discount added.', 'success');
        } else {
            addToast('Invalid promo code. Try "FOODPREP20" or "FLAT50"', 'error');
        }
    };

    const handleProceedToCheckout = () => {
        if (itemsInCart.length === 0) {
            addToast('Your cart is empty!', 'error');
            return;
        }
        navigate('/order', { state: { discount } });
    };

    if (itemsInCart.length === 0) {
        return (
            <div className="cart-page-wrapper">
                <div className="empty-cart-view">
                    <div className="empty-cart-illustration">
                        <img src={assets.basket_icon} alt="Empty Cart" />
                    </div>
                    <h2>Your Cart is Feeling Hungry!</h2>
                    <p>Looks like you haven't added anything to your cart yet. Explore our mouthwatering dishes and treat yourself.</p>
                    <Link to="/" className="explore-food-btn">
                        Explore Food Menu ➔
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <div className="cart-header-title">
                <h1>Review Your Cart</h1>
                <p>Verify your selected dishes before continuing to checkout.</p>
            </div>

            <div className="cart-layout-grid">
                {/* Left Column: Items List */}
                <div className="cart-items-column">
                    <div className="cart-table-card">
                        <div className="cart-table-header">
                            <span className="col-dish">Dish Details</span>
                            <span className="col-price">Price</span>
                            <span className="col-qty">Quantity</span>
                            <span className="col-total">Subtotal</span>
                        </div>

                        <div className="cart-items-list">
                            {itemsInCart.map((food) => {
                                const qty = cartItems[food._id];
                                const itemTotal = food.price * qty;
                                const imgPath = food.image ? `${url}/image/${food.image}` : assets.header_img;

                                return (
                                    <div key={food._id} className="cart-item-row">
                                        <div className="col-dish cart-dish-cell">
                                            <img
                                                src={imgPath}
                                                alt={food.name}
                                                className="cart-dish-thumb"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = assets.header_img;
                                                }}
                                            />
                                            <div className="cart-dish-meta">
                                                <h4>{food.name}</h4>
                                                <span className="dish-category-label">{food.category}</span>
                                            </div>
                                        </div>

                                        <div className="col-price cart-price-cell">
                                            ₹{food.price}
                                        </div>

                                        <div className="col-qty cart-qty-cell">
                                            <div className="cart-quantity-control">
                                                <button
                                                    onClick={() => removeFromCart(food._id)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <span>{qty}</span>
                                                <button
                                                    onClick={() => addToCart(food._id)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-total cart-total-cell">
                                            ₹{itemTotal}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-table-footer">
                            <button className="clear-cart-text-btn" onClick={clearCart}>
                                Clear Cart
                            </button>
                            <Link to="/" className="continue-shopping-link">
                                + Add More Dishes
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary & Promo */}
                <div className="cart-summary-column">
                    {/* Promo Code Box */}
                    <div className="cart-promo-card">
                        <h3>Have a Coupon?</h3>
                        <form onSubmit={handleApplyPromo} className="promo-input-row">
                            <input
                                type="text"
                                placeholder="Enter code (e.g. FOODPREP20)"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                disabled={promoApplied}
                            />
                            <button
                                type="submit"
                                className="apply-promo-btn"
                                disabled={promoApplied || !promoCode.trim()}
                            >
                                {promoApplied ? 'Applied' : 'Apply'}
                            </button>
                        </form>
                        {promoApplied && (
                            <p className="promo-success-text">
                                ✓ Promo applied! You saved ₹{discount}
                            </p>
                        )}
                    </div>

                    {/* Bill Details */}
                    <div className="cart-bill-card">
                        <h3>Order Bill Summary</h3>

                        <div className="bill-rows">
                            <div className="bill-row">
                                <span>Item Total</span>
                                <span>₹{subtotal}</span>
                            </div>

                            <div className="bill-row">
                                <span>Delivery Partner Fee</span>
                                <span>₹{deliveryFee}</span>
                            </div>

                            <div className="bill-row">
                                <span>Platform Fee</span>
                                <span>₹{platformFee}</span>
                            </div>

                            {discount > 0 && (
                                <div className="bill-row discount-row">
                                    <span>Coupon Discount</span>
                                    <span>- ₹{discount}</span>
                                </div>
                            )}

                            <hr className="bill-divider" />

                            <div className="bill-row bill-grand-total">
                                <span>To Pay</span>
                                <span>₹{finalTotal}</span>
                            </div>
                        </div>

                        <button
                            className="checkout-proceed-btn"
                            onClick={handleProceedToCheckout}
                        >
                            Proceed to Checkout ➔
                        </button>
                        <p className="checkout-guarantee-note">
                            🔒 Safe & Secure Checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;