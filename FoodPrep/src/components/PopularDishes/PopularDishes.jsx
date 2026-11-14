import React, { useContext, useMemo } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodCard from '../FoodCard/FoodCard';
import './PopularDishes.css';

const PopularDishes = () => {
    const { food_list, loadingFoods } = useContext(StoreContext);

    // Curate top popular dishes across various categories
    const popularDishes = useMemo(() => {
        if (!food_list || food_list.length === 0) return [];
        
        // Pick dishes that have high rating or pick diverse favorites across categories
        const sorted = [...food_list].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        
        // Take top 6 dishes to present an engaging, appetizing showcase
        return sorted.slice(0, 6);
    }, [food_list]);

    if (!loadingFoods && popularDishes.length === 0) {
        return null;
    }

    return (
        <section className="foodprep-popular-section" id="popular-dishes">
            <div className="popular-header-block">
                <div>
                    <span className="popular-tag">Customer Favorites</span>
                    <h2 className="popular-title">Popular Dishes</h2>
                    <p className="popular-subtitle">
                        Most-ordered delicacies crafted by certified kitchens, loved by food lovers everywhere.
                    </p>
                </div>
                <button
                    type="button"
                    className="view-all-dishes-btn"
                    onClick={() => {
                        const el = document.getElementById('food-display');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    View Full Menu ➔
                </button>
            </div>

            {loadingFoods ? (
                <div className="popular-skeletons-grid">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="popular-skeleton-card">
                            <div className="skeleton-thumb"></div>
                            <div className="skeleton-bar bar-title"></div>
                            <div className="skeleton-bar bar-price"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="popular-dishes-grid">
                    {popularDishes.map((item) => (
                        <FoodCard
                            key={`popular-${item._id}`}
                            id={item._id}
                            name={item.name}
                            price={item.price}
                            description={item.description}
                            image={item.image}
                            category={item.category}
                            rating={item.rating}
                            isAvailable={item.isAvailable}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PopularDishes;
