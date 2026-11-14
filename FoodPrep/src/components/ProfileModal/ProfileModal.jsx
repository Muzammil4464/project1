import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, token, url, updateUserState, logout, addToast } = useContext(StoreContext);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [stateVal, setStateVal] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('India');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && token) {
            // Fetch latest profile
            fetch(`${url}/api/user/profile`, {
                headers: { token }
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.user) {
                        setName(data.user.name || '');
                        setPhone(data.user.phone || '');
                        if (data.user.address) {
                            setStreet(data.user.address.street || '');
                            setCity(data.user.address.city || '');
                            setStateVal(data.user.address.state || '');
                            setZipCode(data.user.address.zipCode || '');
                            setCountry(data.user.address.country || 'India');
                        }
                    }
                })
                .catch((err) => console.error('Fetch profile err:', err));
        }
    }, [isOpen, token, url]);

    if (!isOpen || !user) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch(`${url}/api/user/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token
                },
                body: JSON.stringify({
                    name,
                    phone,
                    address: {
                        street,
                        city,
                        state: stateVal,
                        zipCode,
                        country
                    }
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                updateUserState({
                    ...user,
                    name: data.user.name,
                    phone: data.user.phone,
                    address: data.user.address
                });
                addToast('Profile updated successfully!', 'success');
                onClose();
            } else {
                addToast(data.message || 'Failed to update profile.', 'error');
            }
        } catch (err) {
            console.error('Update profile error:', err);
            addToast('Network error while saving profile.', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="profile-modal-header">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar-letters">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h3>{user.name}</h3>
                            <p className="profile-email-badge">{user.email}</p>
                        </div>
                    </div>
                    <button className="profile-close-btn" onClick={onClose}>
                        <img src={assets.cross_icon} alt="Close" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="profile-form">
                    <div className="profile-section-title">Personal Details</div>
                    <div className="profile-grid">
                        <div className="profile-field">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="profile-field">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                placeholder="+91 9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="profile-section-title">Default Delivery Address</div>
                    <div className="profile-field">
                        <label>Street Address</label>
                        <input
                            type="text"
                            placeholder="Flat / House No., Street, Area"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                    </div>

                    <div className="profile-grid">
                        <div className="profile-field">
                            <label>City</label>
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div className="profile-field">
                            <label>State</label>
                            <input
                                type="text"
                                placeholder="State"
                                value={stateVal}
                                onChange={(e) => setStateVal(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="profile-grid">
                        <div className="profile-field">
                            <label>Zip / Postal Code</label>
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                        </div>
                        <div className="profile-field">
                            <label>Country</label>
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button
                            type="button"
                            className="profile-logout-btn"
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                        >
                            Log Out
                        </button>
                        <button
                            type="submit"
                            className="profile-save-btn"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
