import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import './Orders.css';

const Orders = () => {
    const { url, adminToken } = useContext(AdminContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchAllOrders = useCallback(async () => {
        if (!adminToken) return;
        setLoading(true);
        try {
            const endpoint = statusFilter === 'All'
                ? `${url}/api/order/list`
                : `${url}/api/order/list?status=${encodeURIComponent(statusFilter)}`;

            const response = await axios.get(endpoint, {
                headers: { token: adminToken }
            });

            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                toast.error(response.data.message || 'Failed to retrieve orders.');
            }
        } catch (error) {
            console.error('Error fetching admin orders:', error);
            toast.error('Unable to load orders from server.');
        } finally {
            setLoading(false);
        }
    }, [url, adminToken, statusFilter]);

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.post(
                `${url}/api/order/status`,
                { orderId, status: newStatus },
                { headers: { token: adminToken } }
            );

            if (response.data.success) {
                toast.success(`Order #${orderId.slice(-6).toUpperCase()} updated to "${newStatus}"!`);
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            } else {
                toast.error(response.data.message || 'Status update failed.');
            }
        } catch (error) {
            console.error('Status update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update order status.');
        }
    };

    return (
        <div className="admin-orders-screen">
            {/* Header */}
            <div className="orders-screen-header">
                <div>
                    <h2>Live Order Operations</h2>
                    <p>Monitor incoming customer orders, review deliveries, and update dispatch statuses in real time.</p>
                </div>
                <button onClick={fetchAllOrders} className="orders-refresh-btn">
                    🔄 Refresh Orders
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="orders-status-tabs">
                {['All', 'Order Placed', 'Food Processing', 'Out for delivery', 'Delivered', 'Cancelled'].map((tab) => (
                    <button
                        key={tab}
                        className={`status-tab-btn ${statusFilter === tab ? 'active' : ''}`}
                        onClick={() => setStatusFilter(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Orders Feed */}
            {loading ? (
                <div className="orders-loading-wrap">
                    <div className="spinner"></div>
                    <p>Loading live customer orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="orders-empty-state">
                    <img src={assets.parcel_icon} alt="Empty" className="empty-parcel-icon" />
                    <h3>No Orders Found</h3>
                    <p>There are currently no orders under the "{statusFilter}" filter.</p>
                </div>
            ) : (
                <div className="orders-grid-cards">
                    {orders.map((order) => {
                        const orderDate = new Date(order.createdAt || order.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        return (
                            <div key={order._id} className="admin-order-card">
                                {/* Top Header */}
                                <div className="admin-order-card-header">
                                    <div className="admin-order-meta">
                                        <span className="order-number-tag">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </span>
                                        <span className="order-timestamp">{orderDate}</span>
                                    </div>

                                    {/* Status Modifier Dropdown */}
                                    <div className="admin-status-updater">
                                        <label>Status:</label>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`status-select ${order.status.toLowerCase().replace(/\s+/g, '-')}`}
                                        >
                                            <option value="Order Placed">Order Placed</option>
                                            <option value="Food Processing">Food Processing</option>
                                            <option value="Out for delivery">Out for delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Body: Customer info & Items */}
                                <div className="admin-order-body">
                                    {/* Customer & Address Details */}
                                    <div className="admin-customer-col">
                                        <h4>👤 Customer & Delivery Address</h4>
                                        <div className="customer-info-box">
                                            <p className="cust-name">
                                                <strong>{order.address?.firstName} {order.address?.lastName}</strong>
                                            </p>
                                            <p className="cust-contact">
                                                📞 {order.address?.phone} • ✉ {order.address?.email}
                                            </p>
                                            <p className="cust-address">
                                                📍 {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipCode}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Ordered Items Breakdown */}
                                    <div className="admin-items-col">
                                        <h4>🍲 Ordered Items ({order.items?.length || 0})</h4>
                                        <div className="admin-items-table">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="admin-item-line">
                                                    <span className="item-qty-badge">{item.quantity}x</span>
                                                    <span className="item-name-text">{item.name}</span>
                                                    <span className="item-price-text">₹{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer: Total & Payment */}
                                <div className="admin-order-footer">
                                    <div className="admin-payment-info">
                                        <span>Payment Mode: </span>
                                        <strong>{order.paymentMethod === 'Online' ? 'Online Digital' : 'Cash on Delivery (COD)'}</strong>
                                        <span className={`payment-status-badge ${order.payment ? 'paid' : 'unpaid'}`}>
                                            {order.payment ? 'Paid ✓' : 'Payment on Delivery'}
                                        </span>
                                    </div>

                                    <div className="admin-order-total-amount">
                                        <span>Total Amount:</span>
                                        <strong>₹{order.amount}</strong>
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

export default Orders;