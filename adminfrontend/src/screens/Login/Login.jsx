import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import './Login.css';

const AdminLogin = () => {
    const { loginAdmin } = useContext(AdminContext);
    const [email, setEmail] = useState('admin@foodprep.com');
    const [password, setPassword] = useState('Admin@12345');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        const res = await loginAdmin(email, password);
        setLoading(false);

        if (res.success) {
            navigate('/dashboard');
        } else {
            setErrorMsg(res.message || 'Invalid administrator credentials');
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-card">
                <div className="admin-login-brand">
                    <img src={assets.logo} alt="FoodPrep" className="admin-brand-logo" />
                    <span className="admin-portal-badge">Executive Control</span>
                </div>

                <div className="admin-login-title">
                    <h2>Admin Portal Login</h2>
                    <p>Enter your authorized administrator credentials to manage dishes, orders, and business analytics.</p>
                </div>

                {errorMsg && (
                    <div className="admin-error-alert">
                        <span>⚠</span>
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-field-group">
                        <label htmlFor="admin-email">Administrator Email</label>
                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@foodprep.com"
                            required
                        />
                    </div>

                    <div className="admin-field-group">
                        <div className="password-header-row">
                            <label htmlFor="admin-password">Secure Password</label>
                            <button
                                type="button"
                                className="admin-pwd-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <input
                            id="admin-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div className="admin-creds-hint">
                        <p>Default Provisioned Admin Account:</p>
                        <code>admin@foodprep.com</code> • <code>Admin@12345</code>
                    </div>

                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard ➔'}
                    </button>
                </form>

                <div className="admin-security-footer">
                    <span>🔒 256-bit Encrypted Admin Session</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
