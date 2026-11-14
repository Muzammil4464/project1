import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './Header.css';

const Header = () => {
    const { searchQuery, setSearchQuery, setCategory } = useContext(StoreContext);

    // Smooth scroll to the Explore Menu section
    const scrollToExplore = () => {
        const target = document.getElementById('explore-menu');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Smooth scroll to Food Listing
    const scrollToFoodListing = () => {
        const target = document.getElementById('food-display');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Handle Hero Search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        scrollToFoodListing();
    };

    // Handle Quick Craving Tag selection
    const handleQuickFilter = (categoryName) => {
        setCategory(categoryName);
        setSearchQuery('');
        scrollToFoodListing();
    };

    return (
        <section className="foodprep-hero-section" id="hero-banner">
            {/* Ambient Background Glows */}
            <div className="hero-ambient-glow" aria-hidden="true"></div>
            <div className="hero-pattern-overlay" aria-hidden="true"></div>

            {/* Left Decorative Food Photography Flank */}
            <div className="hero-decor-flank flank-left" aria-hidden="true">
                <div className="decor-plate plate-left-1" title="Italian Cheese Pasta">
                    <img src={assets.food_25 || assets.food_5} alt="" />
                </div>
                <div className="decor-plate plate-left-2" title="Gourmet Burger & Sandwich">
                    <img src={assets.food_15 || assets.food_13} alt="" />
                </div>
                <div className="decor-plate plate-left-3" title="Fresh Garden Vegetable Salad">
                    <img src={assets.food_1 || assets.food_2} alt="" />
                </div>
                <div className="decor-plate plate-left-4" title="Chef Crispy Rolls">
                    <img src={assets.food_7 || assets.food_8} alt="" />
                </div>
            </div>

            {/* Center Content Section */}
            <div className="hero-center-container">
                <h1 className="hero-heading">
                    Delicious Food, Delivered to You!
                </h1>

                <p className="hero-description">
                    Discover your favourite dishes, explore exciting flavours, and enjoy delicious meals with FoodPrep.
                </p>

                {/* Integrated Food Search Bar */}
                <form className="hero-search-container" onSubmit={handleSearchSubmit}>
                    <div className="hero-search-icon-wrap">
                        <svg
                            className="hero-search-svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>

                    <input
                        type="text"
                        className="hero-search-input"
                        placeholder="Search for your favourite food..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search for your favourite food"
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            className="hero-clear-search-btn"
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear search query"
                        >
                            ×
                        </button>
                    )}

                    <button
                        type="submit"
                        className="hero-search-submit-btn"
                        aria-label="Submit search"
                    >
                        Search
                    </button>
                </form>

                {/* Quick Trending Cravings */}
                <div className="hero-trending-cravings">
                    <span className="cravings-label">Popular cravings:</span>
                    <button type="button" onClick={() => handleQuickFilter('Pure Veg')}>
                        Pure Veg
                    </button>
                    <button type="button" onClick={() => handleQuickFilter('Rolls')}>
                        Rolls
                    </button>
                    <button type="button" onClick={() => handleQuickFilter('Pasta')}>
                        Pasta
                    </button>
                    <button type="button" onClick={() => handleQuickFilter('Sandwich')}>
                        Burgers
                    </button>
                    <button type="button" onClick={() => handleQuickFilter('Salad')}>
                        Salad
                    </button>
                    <button type="button" onClick={() => handleQuickFilter('Cake')}>
                        Desserts
                    </button>
                </div>

                {/* Primary CTA Button */}
                <div className="hero-cta-wrapper">
                    <button
                        type="button"
                        className="hero-explore-food-btn"
                        onClick={scrollToExplore}
                    >
                        Explore Food →
                    </button>
                </div>
            </div>

            {/* Right Decorative Food Photography Flank */}
            <div className="hero-decor-flank flank-right" aria-hidden="true">
                <div className="decor-plate plate-right-1" title="Savory Wok Noodles">
                    <img src={assets.food_30 || assets.food_29} alt="" />
                </div>
                <div className="decor-plate plate-right-2" title="Aromatic Biryani & Pulao">
                    <img src={assets.food_23 || assets.food_24} alt="" />
                </div>
                <div className="decor-plate plate-right-3" title="Butterscotch Cake Delight">
                    <img src={assets.food_19 || assets.food_20} alt="" />
                </div>
                <div className="decor-plate plate-right-4" title="Artisanal Fruit Dessert">
                    <img src={assets.food_10 || assets.food_9} alt="" />
                </div>
            </div>
        </section>
    );
};

export default Header;