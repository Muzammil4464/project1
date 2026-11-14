import React, { useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import './LoginPopup.css';

const LoginPopup = ({ setShowLogin }) => {
    const { url, login, addToast } = useContext(StoreContext);

    const [currState, setCurrState] = useState('Sign In');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errorMsg) setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Client-side validations
        if (!formData.email || !formData.password) {
            setErrorMsg('Please fill in all required fields.');
            return;
        }

        if (currState === 'Sign Up') {
            if (!formData.name.trim()) {
                setErrorMsg('Please enter your full name.');
                return;
            }
            if (formData.password.length < 8) {
                setErrorMsg('Password must be at least 8 characters long.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setErrorMsg('Passwords do not match. Please re-enter.');
                return;
            }
            if (!agreeTerms) {
                setErrorMsg('Please agree to the Terms of Service to continue.');
                return;
            }
        }

        setSubmitting(true);

        try {
            const endpoint = currState === 'Sign In' ? '/api/user/login' : '/api/user/register';
            const payload = currState === 'Sign In'
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };

            const response = await fetch(`${url}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                login(data.token, data.user);
                setShowLogin(false);
            } else {
                setErrorMsg(data.message || 'Authentication failed. Please verify your details.');
                addToast(data.message || 'Authentication failed', 'error');
            }
        } catch (err) {
            console.error('Auth request error:', err);
            setErrorMsg('Unable to connect to the authentication server. Please check your connection.');
            addToast('Network error during authentication.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-popup" onClick={() => setShowLogin(false)}>
            <div className="login-popup-container" onClick={(e) => e.stopPropagation()}>
                <div className="login-popup-header">
                    <div className="login-brand-badge">
                        <img src={assets.logo_icon || assets.logo} alt="FoodPrep" className="popup-logo-icon" />
                        <span>FoodPrep Account</span>
                    </div>
                    <button
                        type="button"
                        className="popup-close-btn"
                        onClick={() => setShowLogin(false)}
                        aria-label="Close"
                    >
                        <img src={assets.cross_icon} alt="Close" />
                    </button>
                </div>

                <div className="login-popup-title-area">
                    <h2>{currState === 'Sign In' ? 'Welcome Back!' : 'Create an Account'}</h2>
                    <p className="login-subtext">
                        {currState === 'Sign In'
                            ? 'Sign in to access your saved orders, favorites, and fast checkout.'
                            : 'Join FoodPrep to start ordering delicious dishes right to your doorstep.'}
                    </p>
                </div>

                {errorMsg && (
                    <div className="login-error-banner">
                        <span className="error-icon">⚠</span>
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-popup-form">
                    <div className="login-popup-inputs">
                        {currState === 'Sign Up' && (
                            <div className="input-field-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={onChangeHandler}
                                    required
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="input-field-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        <div className="input-field-group">
                            <div className="label-with-action">
                                <label htmlFor="password">Password</label>
                                <button
                                    type="button"
                                    className="toggle-password-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder={currState === 'Sign Up' ? 'At least 8 characters' : 'Enter your password'}
                                value={formData.password}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        {currState === 'Sign Up' && (
                            <div className="input-field-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={onChangeHandler}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {currState === 'Sign Up' && (
                        <div className="login-popup-condition">
                            <input
                                type="checkbox"
                                id="terms-checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                            />
                            <label htmlFor="terms-checkbox">
                                By signing up, I agree to FoodPrep's <strong>Terms of Service</strong> & <strong>Privacy Policy</strong>.
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn login-submit-btn"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <span className="button-spinner-wrap">
                                <span className="btn-spinner"></span>
                                {currState === 'Sign In' ? 'Signing in...' : 'Creating Account...'}
                            </span>
                        ) : (
                            currState === 'Sign In' ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                <div className="login-popup-footer">
                    {currState === 'Sign In' ? (
                        <p>
                            Don't have an account?{' '}
                            <span
                                className="auth-switch-link"
                                onClick={() => {
                                    setCurrState('Sign Up');
                                    setErrorMsg('');
                                }}
                            >
                                Sign Up
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <span
                                className="auth-switch-link"
                                onClick={() => {
                                    setCurrState('Sign In');
                                    setErrorMsg('');
                                }}
                            >
                                Sign In
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;