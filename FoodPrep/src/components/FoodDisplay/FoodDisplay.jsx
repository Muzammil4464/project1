import React, { useContext, useMemo } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodCard from '../FoodCard/FoodCard';
import './FoodDisplay.css';

const FoodDisplay = () => {
    const {
        food_list,
        loadingFoods,
        category,
        setCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy
    } = useContext(StoreContext);

    // Filter and sort items dynamically
    const filteredFoods = useMemo(() => {
        let list = [...food_list];

        // Filter by category
        if (category && category !== 'All') {
            list = list.filter(
                (item) => item.category?.toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by search query
        if (searchQuery && searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(
                (item) =>
                    item.name?.toLowerCase().includes(q) ||
                    item.description?.toLowerCase().includes(q) ||
                    item.category?.toLowerCase().includes(q)
            );
        }

        // Sort items
        if (sortBy === 'price-low') {
            list.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            list.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            list.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        }

        return list;
    }, [food_list, category, searchQuery, sortBy]);

    return (
        <section className="foodprep-food-display" id="food-display">
            {/* Header with Title and Sorting Controls */}
            <div className="display-controls-header">
                <div className="display-title-group">
                    <span className="display-sub">Chef Curated Menu</span>
                    <h2 className="display-main-heading">
                        {category === 'All' ? 'Top Dishes Near You' : `${category} Specialties`}
                    </h2>
                    <p className="display-count-badge">
                        Showing <strong>{filteredFoods.length}</strong> delicious options
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                </div>

                <div className="display-filters-toolbar">
                    <div className="sort-dropdown-wrap">
                        <label htmlFor="sort-select">Sort by:</label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popular">Recommended</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading Skeletons */}
            {loadingFoods ? (
                <div className="food-grid-skeletons">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="food-card-skeleton">
                            <div className="skeleton-img"></div>
                            <div className="skeleton-lines">
                                <div className="skeleton-line line-title"></div>
                                <div className="skeleton-line line-desc"></div>
                                <div className="skeleton-line line-price"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredFoods.length === 0 ? (
                /* Empty State */
                <div className="food-empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3>No dishes found</h3>
                    <p>
                        We couldn't find any dishes matching your current selection.
                        Try adjusting your search or category filters.
                    </p>
                    <button
                        className="reset-filters-btn"
                        onClick={() => {
                            setCategory('All');
                            setSearchQuery('');
                        }}
                    >
                        View All Dishes
                    </button>
                </div>
            ) : (
                /* Food Grid */
                <div className="food-grid-layout">
                    {filteredFoods.map((item) => (
                        <FoodCard
                            key={item._id}
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

export default FoodDisplay;