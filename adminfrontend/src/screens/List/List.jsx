import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import './List.css';

const List = () => {
    const { url, adminToken } = useContext(AdminContext);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Edit Modal State
    const [editingFood, setEditingFood] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        isAvailable: true
    });
    const [editImage, setEditImage] = useState(null);
    const [savingEdit, setSavingEdit] = useState(false);

    // Fetch list (FIXED: no infinite loop dependency!)
    const fetchList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success && Array.isArray(response.data.data)) {
                setList(response.data.data);
            } else if (Array.isArray(response.data.data)) {
                setList(response.data.data);
            }
        } catch (error) {
            console.error('Error listing foods:', error);
            toast.error('Failed to load food dishes from server.');
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    // Delete Food
    const removeFood = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await axios.delete(`${url}/api/food/remove?id=${id}`, {
                headers: { token: adminToken }
            });
            if (response.data.success) {
                toast.success(response.data.message || 'Food item removed successfully.');
                setList((prev) => prev.filter((item) => item._id !== id));
            } else {
                toast.error(response.data.message || 'Could not delete food.');
            }
        } catch (error) {
            console.error('Delete food error:', error);
            toast.error(error.response?.data?.message || 'Error deleting food item.');
        }
    };

    // Quick toggle availability
    const toggleAvailability = async (item) => {
        const newStatus = !item.isAvailable;
        try {
            const formData = new FormData();
            formData.append('id', item._id);
            formData.append('isAvailable', newStatus);

            const response = await axios.post(`${url}/api/food/update`, formData, {
                headers: { token: adminToken }
            });

            if (response.data.success) {
                setList((prev) =>
                    prev.map((f) => (f._id === item._id ? { ...f, isAvailable: newStatus } : f))
                );
                toast.success(`"${item.name}" is now ${newStatus ? 'In Stock' : 'Out of Stock'}.`);
            }
        } catch (err) {
            console.error('Availability toggle error:', err);
            toast.error('Failed to update availability status.');
        }
    };

    // Open Edit Modal
    const handleOpenEdit = (item) => {
        setEditingFood(item);
        setEditFormData({
            name: item.name,
            price: item.price,
            category: item.category,
            description: item.description,
            isAvailable: item.isAvailable !== false
        });
        setEditImage(null);
    };

    // Save Edit
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setSavingEdit(true);

        try {
            const formData = new FormData();
            formData.append('id', editingFood._id);
            formData.append('name', editFormData.name);
            formData.append('price', Number(editFormData.price));
            formData.append('category', editFormData.category);
            formData.append('description', editFormData.description);
            formData.append('isAvailable', editFormData.isAvailable);

            if (editImage) {
                formData.append('image', editImage);
            }

            const response = await axios.post(`${url}/api/food/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: adminToken
                }
            });

            if (response.data.success) {
                toast.success('Food dish updated successfully!');
                setEditingFood(null);
                fetchList();
            } else {
                toast.error(response.data.message || 'Update failed.');
            }
        } catch (err) {
            console.error('Save edit error:', err);
            toast.error('Failed to update dish.');
        } finally {
            setSavingEdit(false);
        }
    };

    // Filter list
    const filteredList = list.filter((item) => {
        const matchesCategory =
            selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
            !search.trim() ||
            item.name?.toLowerCase().includes(search.toLowerCase()) ||
            item.category?.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="admin-list-screen">
            {/* Top Bar with Controls */}
            <div className="list-screen-header">
                <div>
                    <h2>Food Dishes Catalog</h2>
                    <p>Manage all culinary offerings, prices, availability, and menu listings.</p>
                </div>

                <div className="list-controls-bar">
                    <input
                        type="text"
                        placeholder="Search by dish or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="list-search-input"
                    />

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="list-category-filter"
                    >
                        <option value="All">All Categories</option>
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="Pasta">Pasta</option>
                        <option value="Noodles">Noodles</option>
                    </select>

                    <button onClick={fetchList} className="list-refresh-btn" title="Refresh Table">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="list-table-card">
                {loading ? (
                    <div className="table-loading-wrap">
                        <div className="spinner"></div>
                        <p>Loading dishes...</p>
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="table-empty-wrap">
                        <p>No dishes found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="table-responsive-wrapper">
                        <table className="admin-foods-table">
                            <thead>
                                <tr>
                                    <th>Dish Image</th>
                                    <th>Dish Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Availability</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.map((item) => {
                                    const imgUrl = `${url}/image/${item.image}`;
                                    const inStock = item.isAvailable !== false;
                                    return (
                                        <tr key={item._id}>
                                            <td className="food-thumb-cell">
                                                <img
                                                    src={imgUrl}
                                                    alt={item.name}
                                                    className="admin-dish-thumb"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = assets.upload_area;
                                                    }}
                                                />
                                            </td>
                                            <td className="food-name-cell">
                                                <strong>{item.name}</strong>
                                                <p className="food-desc-excerpt">{item.description}</p>
                                            </td>
                                            <td>
                                                <span className="food-category-pill">{item.category}</span>
                                            </td>
                                            <td className="food-price-cell">
                                                ₹{item.price}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={`stock-toggle-btn ${inStock ? 'in-stock' : 'out-of-stock'}`}
                                                    onClick={() => toggleAvailability(item)}
                                                    title="Click to toggle stock status"
                                                >
                                                    {inStock ? '● In Stock' : '○ Out of Stock'}
                                                </button>
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    className="action-edit-btn"
                                                    onClick={() => handleOpenEdit(item)}
                                                    title="Edit food"
                                                >
                                                    ✎ Edit
                                                </button>
                                                <button
                                                    className="action-delete-btn"
                                                    onClick={() => removeFood(item._id, item.name)}
                                                    title="Delete food"
                                                >
                                                    🗑 Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Food Modal */}
            {editingFood && (
                <div className="edit-modal-overlay" onClick={() => setEditingFood(null)}>
                    <div className="edit-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="edit-modal-header">
                            <h3>Edit Food Dish: {editingFood.name}</h3>
                            <button className="edit-close-btn" onClick={() => setEditingFood(null)}>✕</button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="edit-modal-form">
                            <div className="edit-form-field">
                                <label>Dish Name</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="edit-form-row">
                                <div className="edit-form-field">
                                    <label>Category</label>
                                    <select
                                        value={editFormData.category}
                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                    >
                                        <option value="Salad">Salad</option>
                                        <option value="Rolls">Rolls</option>
                                        <option value="Deserts">Deserts</option>
                                        <option value="Sandwich">Sandwich</option>
                                        <option value="Cake">Cake</option>
                                        <option value="Pure Veg">Pure Veg</option>
                                        <option value="Pasta">Pasta</option>
                                        <option value="Noodles">Noodles</option>
                                    </select>
                                </div>

                                <div className="edit-form-field">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        value={editFormData.price}
                                        onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="edit-form-field">
                                <label>Description</label>
                                <textarea
                                    rows="3"
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="edit-form-field">
                                <label>Replace Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditImage(e.target.files[0])}
                                />
                            </div>

                            <div className="edit-checkbox-field">
                                <input
                                    type="checkbox"
                                    id="edit-instock"
                                    checked={editFormData.isAvailable}
                                    onChange={(e) => setEditFormData({ ...editFormData, isAvailable: e.target.checked })}
                                />
                                <label htmlFor="edit-instock">Dish is currently available in stock</label>
                            </div>

                            <div className="edit-modal-actions">
                                <button type="button" className="edit-cancel-btn" onClick={() => setEditingFood(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="edit-submit-btn" disabled={savingEdit}>
                                    {savingEdit ? 'Saving...' : 'Save Updates'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default List;