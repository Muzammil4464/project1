import React from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import PopularDishes from '../../components/PopularDishes/PopularDishes';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { assets } from '../../assets/assets';
import './Home.css';

const Home = () => {
    return (
        <div className="foodprep-home-view">
            {/* Full-Width Swiggy-Inspired Food-Themed Hero Banner */}
            <Header />

            {/* Inner Content Container for Main Food Ordering Experience */}
            <div className="app-content-container">
                {/* 1. Explore Food Categories */}
                <ExploreMenu />

                {/* 2. Popular Dishes Showcase */}
                <PopularDishes />

                {/* 3. Complete Food Listing with Search & Filters */}
                <FoodDisplay />

                {/* 4. Additional Promotional Section: Mobile App Banner */}
                <section className="foodprep-app-download-banner">
                    <div className="app-download-content">
                        <span className="app-banner-tag">Better on Mobile</span>
                        <h2>Download the FoodPrep App for Instant Perks</h2>
                        <p>
                            Get exclusive discounts, track deliveries in real time, and save your favorite meals for 1-click reordering.
                        </p>
                        <div className="app-store-badges">
                            <img src={assets.play_store} alt="Get it on Google Play" />
                            <img src={assets.app_store} alt="Download on the App Store" />
                        </div>
                    </div>
                </section>

                {/* 5. Why Choose FoodPrep Section */}
                <section className="foodprep-guarantee-section" id="why-foodprep">
                    <div className="section-header-block">
                        <span className="section-tag">Quality Assured</span>
                        <h2 className="section-title">Why Foodies Love FoodPrep</h2>
                        <p className="section-subtitle">
                            Experience our commitment to lightning speed, culinary excellence, and end-to-end reliability with every order.
                        </p>
                    </div>

                    <div className="foodprep-guarantee-strip">
                        <div className="guarantee-card">
                            <span className="guarantee-emoji">🚀</span>
                            <div>
                                <h4>Lightning Fast Delivery</h4>
                                <p>Hot & fresh meals at your doorstep in under 30 minutes.</p>
                            </div>
                        </div>
                        <div className="guarantee-card">
                            <span className="guarantee-emoji">🛡️</span>
                            <div>
                                <h4>100% Quality Guaranteed</h4>
                                <p>Prepared in verified kitchens with premium fresh ingredients.</p>
                            </div>
                        </div>
                        <div className="guarantee-card">
                            <span className="guarantee-emoji">📍</span>
                            <div>
                                <h4>Real-Time Tracking</h4>
                                <p>Track your food prep and delivery status with precision.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;