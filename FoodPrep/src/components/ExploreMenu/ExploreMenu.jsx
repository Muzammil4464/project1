import React, { useContext } from 'react';
import { menu_list } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './ExploreMenu.css';

const ExploreMenu = () => {
    const { category, setCategory } = useContext(StoreContext);

    return (
        <section className="foodprep-explore-menu" id="explore-menu">
            <div className="section-header-block">
                <span className="section-tag">Taste the Diversity</span>
                <h2 className="section-title">Explore by Popular Category</h2>
                <p className="section-subtitle">
                    Select a category to filter your favorite cravings from fresh garden salads to chef-crafted pasta and desserts.
                </p>
            </div>

            <div className="category-scroll-container">
                {/* 'All' Option */}
                <div
                    className={`category-item-card ${category === 'All' ? 'active' : ''}`}
                    onClick={() => setCategory('All')}
                >
                    <div className="category-image-circle all-category-circle">
                        <span className="all-icon">🍽️</span>
                    </div>
                    <p className="category-name">All Items</p>
                </div>

                {menu_list.map((item, index) => {
                    const isSelected = category === item.menu_name;
                    return (
                        <div
                            key={index}
                            className={`category-item-card ${isSelected ? 'active' : ''}`}
                            onClick={() => setCategory(isSelected ? 'All' : item.menu_name)}
                        >
                            <div className="category-image-circle">
                                <img
                                    src={item.menu_image}
                                    alt={item.menu_name}
                                    className="category-img"
                                />
                            </div>
                            <p className="category-name">{item.menu_name}</p>
                        </div>
                    );
                })}
            </div>
            <div className="category-divider-line"></div>
        </section>
    );
};

export default ExploreMenu;