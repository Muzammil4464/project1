import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrder.css';

const PlaceOrder = ({ setShowLogin }) => {
    const {
        getTotalCartAmount,
        cartItems,
        food_list,
        token,
        user,
        url,
        clearCart,
        addToast
    } = useContext(StoreContext);

    const navigate = useNavigate();
    const location = useLocation();
    const discount = location.state?.discount || 0;

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        phone: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    // Prepopulate user data
    useEffect(() => {
        if (user) {
            const nameParts = (user.name || '').trim().split(' ');
            setAddress((prev) => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || (nameParts[0] ? '' : ''),
                email: user.email || '',
                phone: user.phone || prev.phone,
                street: user.address?.street || prev.street,
                city: user.address?.city || prev.city,
                state: user.address?.state || prev.state,
                zipCode: user.address?.zipCode || prev.zipCode,
                country: user.address?.country || 'India'
            }));
        }
    }, [user]);

    // Calculate amounts
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 0 ? 20 : 0;
    const platformFee = subtotal > 0 ? 5 : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee + platformFee - discount);

    const itemsInCart = food_list.filter((food) => (cartItems[food._id] || 0) > 0);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const required = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'phone'];
        for (const f of required) {
            if (!address[f] || String(address[f]).trim() === '') {
                errors[f] = true;
            }
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (!token) {
            addToast('Please sign in or register to place your order.', 'warning');
            setShowLogin(true);
            return;
        }

        if (itemsInCart.length === 0) {
            addToast('Your cart is empty. Please add items before checking out.', 'error');
            navigate('/');
            return;
        }

        if (!validateForm()) {
            addToast('Please fill in all required delivery details.', 'error');
            return;
        }

        setSubmitting(true);

        try {
            // Build verified order items
            const orderItems = itemsInCart.map((food) => ({
                foodId: food._id,
                name: food.name,
                price: food.price,
                quantity: cartItems[food._id],
                image: food.image,
                category: food.category
            }));

            const response = await fetch(`${url}/api/order/place`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token
                },
                body: JSON.stringify({
                    items: orderItems,
                    address,
                    paymentMethod
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await clearCart();
                addToast('🎉 Order placed successfully! Tracking your delivery now.', 'success');
                navigate('/myorders');
            } else {
                addToast(data.message || 'Could not place order. Please review your cart.', 'error');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            addToast('Network error while placing order. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (itemsInCart.length === 0) {
        return (
            <div className="checkout-empty-state">
                <h2>No items to checkout</h2>
                <p>Your cart is currently empty. Please choose some delicious items first.</p>
                <button onClick={() => navigate('/')} className="return-menu-btn">
                    Explore Menu ➔
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-page-container">
            <div className="checkout-page-header">
                <h1>Complete Your Order</h1>
                <p>Enter your delivery address and choose your payment method.</p>
            </div>

            {!token && (
                <div className="checkout-auth-banner">
                    <div>
                        <strong>Notice:</strong> You are checking out as a guest. Please log in or sign up to finalize and track your order.
                    </div>
                    <button type="button" onClick={() => setShowLogin(true)} className="banner-login-btn">
                        Sign In Now
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmitOrder} className="checkout-form-grid">
                {/* Left Column: Address Form */}
                <div className="checkout-address-column">
                    <div className="checkout-card">
                        <div className="card-section-heading">
                            <span className="step-num">1</span>
                            <h3>Delivery Address</h3>
                        </div>

                        <div className="checkout-form-fields">
                            <div className="fields-row-2">
                                <div className="field-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="John"
                                        value={address.firstName}
                                        onChange={onChangeHandler}
                                        className={fieldErrors.firstName ? 'input-error' : ''}
                                        required
                                    />
                                </div>
                                <div className="field-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={address.lastName}
                                        onChange={onChangeHandler}
                                        className={fieldErrors.lastName ? 'input-error' : ''}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Email Address (For receipt & updates) *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john.doe@example.com"
                                    value={address.email}
                                    onChange={onChangeHandler}
                                    className={fieldErrors.email ? 'input-error' : ''}
                                    required
                                />
                            </div>

                            <div className="field-group">
                                <label>Delivery Address / Street *</label>
                                <input
                                    type="text"
                                    name="street"
                                    placeholder="Flat No, Apartment, Street & Area"
                                    value={address.street}
                                    onChange={onChangeHandler}
                                    className={fieldErrors.street ? 'input-error' : ''}
                                    required
                                />
                            </div>

                            <div className="fields-row-2">
                                <div className="field-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={address.city}
                                        onChange={onChangeHandler}
                                        className={fieldErrors.city ? 'input-error' : ''}
                                        required
                                    />
                                </div>
                                <div className="field-group">
                                    <label>State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={address.state}
                                        onChange={onChangeHandler}
                                        className={fieldErrors.state ? 'input-error' : ''}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="fields-row-2">
                                <div className="field-group">
                                    <label>Zip / Postal Code *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="500001"
                                        value={address.zipCode}
                                        onChange={onChangeHandler}
                                        className={fieldErrors.zipCode ? 'input-error' : ''}
                                        required
                                    />
                                </div>
                                <div className="field-group">
                                    <label>Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={address.country}
                                        onChange={onChangeHandler}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field-group">
                                <label>Contact Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+91 9876543210"
                                    value={address.phone}
                                    onChange={onChangeHandler}
                                    className={fieldErrors.phone ? 'input-error' : ''}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="checkout-card payment-method-card">
                        <div className="card-section-heading">
                            <span className="step-num">2</span>
                            <h3>Payment Method</h3>
                        </div>

                        <div className="payment-options-list">
                            <label className={`payment-option-tile ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={() => setPaymentMethod('COD')}
                                />
                                <div className="payment-tile-body">
                                    <div className="tile-title-row">
                                        <strong>💵 Cash on Delivery (COD)</strong>
                                        <span className="rec-badge">Recommended</span>
                                    </div>
                                    <p>Pay easily with cash or UPI QR scanner upon delivery at your doorstep.</p>
                                </div>
                            </label>

                            <label className={`payment-option-tile ${paymentMethod === 'Online' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="Online"
                                    checked={paymentMethod === 'Online'}
                                    onChange={() => setPaymentMethod('Online')}
                                />
                                <div className="payment-tile-body">
                                    <div className="tile-title-row">
                                        <strong>💳 Online Payment (Instant)</strong>
                                    </div>
                                    <p>Safe digital checkout with order confirmation immediately generated.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Items & Payment Summary */}
                <div className="checkout-summary-column">
                    <div className="checkout-card summary-card">
                        <h3>Order Summary ({itemsInCart.length} Dishes)</h3>

                        <div className="summary-items-list">
                            {itemsInCart.map((food) => {
                                const qty = cartItems[food._id];
                                return (
                                    <div key={food._id} className="summary-item-row">
                                        <div className="summary-item-info">
                                            <span className="summary-item-qty">{qty}x</span>
                                            <span className="summary-item-name">{food.name}</span>
                                        </div>
                                        <span className="summary-item-price">₹{food.price * qty}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <hr className="summary-divider" />

                        <div className="summary-breakdown">
                            <div className="breakdown-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="breakdown-row">
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee}</span>
                            </div>
                            <div className="breakdown-row">
                                <span>Platform Fee</span>
                                <span>₹{platformFee}</span>
                            </div>
                            {discount > 0 && (
                                <div className="breakdown-row discount">
                                    <span>Discount</span>
                                    <span>- ₹{discount}</span>
                                </div>
                            )}
                            <hr className="summary-divider" />
                            <div className="breakdown-row final-row">
                                <span>Total Payable</span>
                                <span>₹{finalTotal}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="place-order-submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <span className="btn-spinner-wrap">
                                    <span className="spinner"></span>
                                    Placing Order...
                                </span>
                            ) : (
                                `Confirm Order • ₹${finalTotal}`
                            )}
                        </button>

                        <div className="checkout-trust-indicators">
                            <span>🛡️ Verified Kitchens</span>
                            <span>⚡ Contactless Delivery</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PlaceOrder;