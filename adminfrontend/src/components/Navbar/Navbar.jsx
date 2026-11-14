import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const { adminUser, logoutAdmin, isLoggedIn } = useContext(AdminContext);

    return (
        <header className="admin-navbar">
            <div className="admin-nav-left">
                <Link to="/dashboard" className="admin-logo-link">
                    <img className="admin-logo" src={assets.logo} alt="FoodPrep" />
                </Link>
                <div className="admin-badge-tag">
                    <span>Admin Workspace</span>
                </div>
            </div>

            {isLoggedIn && (
                <div className="admin-nav-right">
                    <div className="admin-profile-pill">
                        <img src={assets.profile_image} alt="" className="admin-avatar" />
                        <div className="admin-profile-meta">
                            <span className="admin-name">{adminUser?.name || 'Super Admin'}</span>
                            <span className="admin-role-label">System Administrator</span>
                        </div>
                    </div>

                    <button
                        onClick={logoutAdmin}
                        className="admin-logout-btn"
                        title="Sign Out from Admin"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </header>
    );
};

export default Navbar;