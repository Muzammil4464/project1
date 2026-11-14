import React, { useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import './Add.css';

const Add = () => {
    const { url, adminToken } = useContext(AdminContext);
    const [image, setImage] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Salad',
        isAvailable: true
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error('Please upload an appetizing image for this dish.');
            return;
        }

        if (Number(data.price) <= 0) {
            toast.error('Please enter a valid price greater than 0.');
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append('name', data.name.trim());
        formData.append('description', data.description.trim());
        formData.append('price', Number(data.price));
        formData.append('category', data.category);
        formData.append('isAvailable', data.isAvailable);
        formData.append('image', image);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: adminToken
                }
            });

            if (response.data.success) {
                toast.success(`🎉 "${data.name}" added to menu successfully!`);
                setData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'Salad',
                    isAvailable: true
                });
                setImage(false);
                navigate('/list');
            } else {
                toast.error(response.data.message || 'Failed to add dish.');
            }
        } catch (error) {
            console.error('Add food error:', error);
            const msg = error.response?.data?.message || 'Error occurred while saving food item.';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-add-screen">
            <div className="add-screen-header">
                <h2>Add New Food Dish</h2>
                <p>Create a new menu entry with fresh photos, description, category, and pricing.</p>
            </div>

            <div className="add-form-card">
                <form onSubmit={onSubmitHandler} className="add-dish-form">
                    {/* Image Upload Area */}
                    <div className="add-img-upload-box">
                        <label className="upload-label-title">Dish Image Upload *</label>
                        <label htmlFor="image-file-input" className="image-drop-area">
                            <img
                                src={image ? URL.createObjectURL(image) : assets.upload_area}
                                alt="Upload Preview"
                                className={image ? 'preview-uploaded' : 'preview-placeholder'}
                            />
                            <div className="image-drop-prompt">
                                <strong>{image ? 'Change dish photo' : 'Click to upload image'}</strong>
                                <span>PNG, JPG, WEBP up to 5MB</span>
                            </div>
                        </label>
                        <input
                            onChange={(e) => setImage(e.target.files[0])}
                            type="file"
                            id="image-file-input"
                            accept="image/*"
                            hidden
                            required
                        />
                    </div>

                    {/* Product Name */}
                    <div className="add-field-group">
                        <label htmlFor="food-name">Product / Dish Name *</label>
                        <input
                            id="food-name"
                            value={data.name}
                            onChange={onChangeHandler}
                            type="text"
                            name="name"
                            placeholder="e.g. Artisanal Truffle Pizza"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="add-field-group">
                        <label htmlFor="food-desc">Dish Description & Ingredients *</label>
                        <textarea
                            id="food-desc"
                            value={data.description}
                            onChange={onChangeHandler}
                            name="description"
                            rows="4"
                            placeholder="Describe the flavors, fresh herbs, toppings, and culinary style..."
                            required
                        ></textarea>
                    </div>

                    {/* Category & Price */}
                    <div className="add-row-2">
                        <div className="add-field-group">
                            <label htmlFor="food-category">Menu Category *</label>
                            <select
                                id="food-category"
                                value={data.category}
                                onChange={onChangeHandler}
                                name="category"
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

                        <div className="add-field-group">
                            <label htmlFor="food-price">Price in Rupees (₹) *</label>
                            <input
                                id="food-price"
                                value={data.price}
                                onChange={onChangeHandler}
                                type="number"
                                name="price"
                                placeholder="180"
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    {/* Stock Status Checkbox */}
                    <div className="add-checkbox-field">
                        <input
                            type="checkbox"
                            id="add-in-stock"
                            checked={data.isAvailable}
                            onChange={(e) => setData({ ...data, isAvailable: e.target.checked })}
                        />
                        <label htmlFor="add-in-stock">
                            Make this dish active and immediately orderable in the user frontend
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="add-submit-row">
                        <button
                            type="submit"
                            className="add-dish-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Publishing to Menu...' : 'Publish Dish to Menu ➔'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Add;