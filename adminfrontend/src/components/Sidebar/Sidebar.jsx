import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-group-title">Menu Management</div>

            <div className="sidebar-menu-items">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">📊</span>
                    <p className="sidebar-label">Dashboard</p>
                </NavLink>

                <NavLink
                    to="/list"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <img src={assets.list_icon} alt="" className="sidebar-icon-img" />
                    <p className="sidebar-label">Food Catalog</p>
                </NavLink>

                <NavLink
                    to="/add"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <img src={assets.add_icon} alt="" className="sidebar-icon-img" />
                    <p className="sidebar-label">Add New Dish</p>
                </NavLink>

                <div className="sidebar-group-title" style={{ marginTop: '20px' }}>
                    Sales & Dispatch
                </div>

                <NavLink
                    to="/orders"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                    <img src={assets.order_icon} alt="" className="sidebar-icon-img" />
                    <p className="sidebar-label">Live Orders</p>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;