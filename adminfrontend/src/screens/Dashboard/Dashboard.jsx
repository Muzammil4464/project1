import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const { metrics, loadingMetrics, fetchMetrics, adminUser } = useContext(AdminContext);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    return (
        <div className="admin-dashboard-screen">
            {/* Top Welcome Banner */}
            <div className="dashboard-welcome-banner">
                <div>
                    <h2>Welcome, {adminUser?.name || 'Administrator'}! 👋</h2>
                    <p>Here is your real-time performance summary across FoodPrep restaurants, orders, and sales.</p>
                </div>
                <button onClick={fetchMetrics} className="metrics-refresh-btn" disabled={loadingMetrics}>
                    {loadingMetrics ? 'Refreshing...' : '🔄 Refresh Metrics'}
                </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="dashboard-kpi-grid">
                <div className="kpi-card revenue-card">
                    <div className="kpi-icon-wrap">💰</div>
                    <div className="kpi-info">
                        <span className="kpi-label">Total Revenue</span>
                        <h3 className="kpi-value">₹{metrics?.totalRevenue ?? 0}</h3>
                        <span className="kpi-sub">Across all completed orders</span>
                    </div>
                </div>

                <div className="kpi-card orders-card">
                    <div className="kpi-icon-wrap">📦</div>
                    <div className="kpi-info">
                        <span className="kpi-label">Total Orders</span>
                        <h3 className="kpi-value">{metrics?.totalOrders ?? 0}</h3>
                        <span className="kpi-sub">Customer orders processed</span>
                    </div>
                </div>

                <div className="kpi-card pending-card">
                    <div className="kpi-icon-wrap">⏳</div>
                    <div className="kpi-info">
                        <span className="kpi-label">Pending Orders</span>
                        <h3 className="kpi-value">{metrics?.pendingOrders ?? 0}</h3>
                        <span className="kpi-sub">Processing & out for delivery</span>
                    </div>
                </div>

                <div className="kpi-card dishes-card">
                    <div className="kpi-icon-wrap">🍽️</div>
                    <div className="kpi-info">
                        <span className="kpi-label">Active Menu Dishes</span>
                        <h3 className="kpi-value">{metrics?.totalFoods ?? 0}</h3>
                        <span className="kpi-sub">Items available on customer menu</span>
                    </div>
                </div>

                <div className="kpi-card delivered-card">
                    <div className="kpi-icon-wrap">✅</div>
                    <div className="kpi-info">
                        <span className="kpi-label">Completed Deliveries</span>
                        <h3 className="kpi-value">{metrics?.completedOrders ?? 0}</h3>
                        <span className="kpi-sub">Delivered successfully</span>
                    </div>
                </div>

                <div className="kpi-card cancelled-card">
                    <div className="kpi-icon-wrap">❌</div>
                    <div className="kpi-info">
                        <span className="kpi-label">Cancelled Orders</span>
                        <h3 className="kpi-value">{metrics?.cancelledOrders ?? 0}</h3>
                        <span className="kpi-sub">Rejected / cancelled</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="dashboard-quick-actions">
                <Link to="/add" className="quick-action-btn primary-action">
                    <span>+ Add New Food Dish</span>
                </Link>
                <Link to="/list" className="quick-action-btn">
                    <span>📋 View Menu List</span>
                </Link>
                <Link to="/orders" className="quick-action-btn">
                    <span>📦 Manage Live Orders</span>
                </Link>
            </div>

            {/* Recent Orders Overview */}
            <div className="dashboard-recent-orders-card">
                <div className="recent-orders-header">
                    <h3>Recent Customer Orders</h3>
                    <Link to="/orders" className="view-all-orders-link">View All Orders ➔</Link>
                </div>

                {(!metrics?.recentOrders || metrics.recentOrders.length === 0) ? (
                    <div className="no-recent-orders">
                        <p>No recent orders found yet.</p>
                    </div>
                ) : (
                    <div className="recent-orders-table-wrap">
                        <table className="recent-orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total Amount</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.recentOrders.map((order) => {
                                    const custName = order.address
                                        ? `${order.address.firstName} ${order.address.lastName}`
                                        : 'Guest User';
                                    return (
                                        <tr key={order._id}>
                                            <td className="order-id-cell">#{order._id.slice(-6).toUpperCase()}</td>
                                            <td>{custName}</td>
                                            <td>{order.items?.length || 0} items</td>
                                            <td className="order-amount-cell">₹{order.amount}</td>
                                            <td>
                                                <span className="payment-tag">
                                                    {order.paymentMethod || 'COD'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    ● {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
