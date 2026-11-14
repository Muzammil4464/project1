import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './Navbar.css';

const Navbar = ({ setShowLogin, openProfileModal }) => {
    const {
        getTotalCartItems,
        token,
        user,
        logout,
        searchQuery,
        setSearchQuery
    } = useContext(StoreContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate('/');
        }
        const foodDisplay = document.getElementById('food-display');
        if (foodDisplay) {
            foodDisplay.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const cartCount = getTotalCartItems();

    return (
        <header className="foodprep-navbar-wrapper">
            <nav className="foodprep-navbar">
                {/* Brand Logo */}
                <Link to="/" className="navbar-logo-wrap">
                    <img className="navbar-logo" src={assets.logo} alt="FoodPrep" />
                </Link>

                {/* Desktop Search Bar */}
                <form
                    onSubmit={handleSearchSubmit}
                    className={`navbar-search-bar ${searchFocused ? 'focused' : ''}`}
                >
                    <img src={assets.search_icon} alt="Search" className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search delicious dishes, cuisines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="clear-search-btn"
                            onClick={() => setSearchQuery('')}
                        >
                            ×
                        </button>
                    )}
                </form>

                {/* Navigation Links */}
                <div className={`navbar-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' && !location.hash ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <a
                        href="/#explore-menu"
                        className="nav-link"
                        onClick={(e) => {
                            if (location.pathname === '/') {
                                e.preventDefault();
                                document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        Explore Menu
                    </a>
                    <a
                        href="/#food-display"
                        className="nav-link"
                        onClick={(e) => {
                            if (location.pathname === '/') {
                                e.preventDefault();
                                document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        Dishes
                    </a>
                    <a
                        href="#footer"
                        className="nav-link"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        About Us
                    </a>
                </div>

                {/* Right Side Actions */}
                <div className="navbar-right">
                    {/* Cart Button */}
                    <Link to="/cart" className="navbar-cart-btn" aria-label="Cart">
                        <img src={assets.basket_icon} alt="Shopping Cart" />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    {/* Authentication Section */}
                    {!token ? (
                        <button
                            className="navbar-signin-btn"
                            onClick={() => setShowLogin(true)}
                        >
                            Sign In
                        </button>
                    ) : (
                        <div className="navbar-user-profile" ref={dropdownRef}>
                            <button
                                className="navbar-profile-trigger"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                aria-label="User Menu"
                            >
                                <div className="user-avatar-circle">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="user-name-label">
                                    {user?.name ? user.name.split(' ')[0] : 'Account'}
                                </span>
                                <span className="dropdown-caret">▼</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="navbar-dropdown-menu">
                                    <div className="dropdown-user-header">
                                        <p className="dropdown-user-name">{user?.name}</p>
                                        <p className="dropdown-user-email">{user?.email}</p>
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            openProfileModal();
                                        }}
                                    >
                                        <img src={assets.profile_icon} alt="" />
                                        <span>My Profile</span>
                                    </button>
                                    <Link
                                        to="/myorders"
                                        className="dropdown-item"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <img src={assets.bag_icon} alt="" />
                                        <span>My Orders</span>
                                    </Link>
                                    <hr className="dropdown-divider" />
                                    <button
                                        className="dropdown-item dropdown-logout"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            logout();
                                        }}
                                    >
                                        <img src={assets.logout_icon} alt="" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Navigation"
                    >
                        <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
                        <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
                        <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;