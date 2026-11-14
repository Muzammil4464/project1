import React, { useContext, useEffect, useState, useCallback } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import './MyOrders.css';

const MyOrders = ({ setShowLogin }) => {
    const { token, url, addToast } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${url}/api/order/userorders`, {
                headers: { token }
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setOrders(data.data || []);
            } else {
                addToast(data.message || 'Could not load your orders.', 'error');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            addToast('Network error while loading orders.', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, url, addToast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (!token) {
        return (
            <div className="myorders-empty-wrap">
                <div className="orders-empty-card">
                    <span className="empty-orders-emoji">🔒</span>
                    <h2>Sign In to View Orders</h2>
                    <p>Please log in to track your current deliveries and past order history.</p>
                    <button onClick={() => setShowLogin(true)} className="orders-login-btn">
                        Sign In Now
                    </button>
                </div>
            </div>
        );
    }

    const getStatusStepIndex = (status) => {
        switch (status) {
            case 'Order Placed': return 1;
            case 'Food Processing': return 2;
            case 'Out for delivery': return 3;
            case 'Delivered': return 4;
            case 'Cancelled': return -1;
            default: return 1;
        }
    };

    return (
        <div className="myorders-page-container">
            <div className="myorders-header-row">
                <div>
                    <h1>My Orders & Tracking</h1>
                    <p>Track your active food orders and view your purchase history.</p>
                </div>
                <button onClick={fetchOrders} className="refresh-orders-btn" title="Refresh Orders">
                    🔄 Refresh Orders
                </button>
            </div>

            {loading ? (
                <div className="orders-loading-state">
                    <div className="orders-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="myorders-empty-wrap">
                    <div className="orders-empty-card">
                        <img src={assets.parcel_icon} alt="No Orders" className="empty-parcel-img" />
                        <h2>No Orders Placed Yet</h2>
                        <p>You haven't ordered any meals yet. Explore our top-rated dishes and place your first order!</p>
                        <Link to="/" className="orders-browse-btn">
                            Browse Menu Now ➔
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="orders-cards-list">
                    {orders.map((order) => {
                        const step = getStatusStepIndex(order.status);
                        const isCancelled = order.status === 'Cancelled';
                        const orderDate = new Date(order.createdAt || order.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div key={order._id} className="order-tracking-card">
                                {/* Order Top Header */}
                                <div className="order-card-top">
                                    <div className="order-meta-info">
                                        <div className="order-id-badge">
                                            <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <span className="order-date-text">{orderDate}</span>
                                    </div>

                                    <div className="order-status-badge-wrap">
                                        <span className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                            ● {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Tracking Progress Stepper (if not cancelled) */}
                                {!isCancelled ? (
                                    <div className="order-progress-stepper">
                                        <div className={`stepper-step ${step >= 1 ? 'completed' : ''}`}>
                                            <div className="step-circle">1</div>
                                            <span>Confirmed</span>
                                        </div>
                                        <div className={`stepper-line ${step >= 2 ? 'active' : ''}`}></div>
                                        <div className={`stepper-step ${step >= 2 ? 'completed' : ''}`}>
                                            <div className="step-circle">2</div>
                                            <span>Preparing</span>
                                        </div>
                                        <div className={`stepper-line ${step >= 3 ? 'active' : ''}`}></div>
                                        <div className={`stepper-step ${step >= 3 ? 'completed' : ''}`}>
                                            <div className="step-circle">3</div>
                                            <span>On the Way</span>
                                        </div>
                                        <div className={`stepper-line ${step >= 4 ? 'active' : ''}`}></div>
                                        <div className={`stepper-step ${step >= 4 ? 'completed' : ''}`}>
                                            <div className="step-circle">4</div>
                                            <span>Delivered</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="order-cancelled-notice">
                                        ⚠ This order was cancelled. Please contact support if you need assistance.
                                    </div>
                                )}

                                {/* Ordered Items Summary */}
                                <div className="order-items-preview">
                                    <h4>Items ({order.items?.length || 0})</h4>
                                    <div className="order-items-scroll">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="order-item-chip">
                                                <span className="chip-qty">{item.quantity}x</span>
                                                <span className="chip-name">{item.name}</span>
                                                <span className="chip-price">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="order-card-bottom">
                                    <div className="order-address-snippet">
                                        <span>📍 Deliver to: </span>
                                        <strong>
                                            {order.address?.street}, {order.address?.city} ({order.address?.zipCode})
                                        </strong>
                                    </div>

                                    <div className="order-total-amount">
                                        <span>Total:</span>
                                        <strong>₹{order.amount}</strong>
                                        <span className="payment-method-chip">
                                            {order.paymentMethod === 'Online' ? 'Online Paid' : 'Cash on Delivery'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
