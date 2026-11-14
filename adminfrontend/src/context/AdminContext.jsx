import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {
    const url = import.meta.env.VITE_API_URL || (
        typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:4000'
            : 'https://food-delivery-backend-5b6g.onrender.com'
    );

    const [adminToken, setAdminToken] = useState(() => localStorage.getItem('foodprep_admin_token') || '');
    const [adminUser, setAdminUser] = useState(() => {
        try {
            const saved = localStorage.getItem('foodprep_admin_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [metrics, setMetrics] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(false);

    const loginAdmin = async (email, password) => {
        try {
            const response = await axios.post(`${url}/api/user/admin-login`, { email, password });
            if (response.data.success && response.data.token) {
                const token = response.data.token;
                const user = response.data.user;

                setAdminToken(token);
                setAdminUser(user);
                localStorage.setItem('foodprep_admin_token', token);
                localStorage.setItem('foodprep_admin_user', JSON.stringify(user));
                toast.success('Welcome to FoodPrep Admin Portal!');
                return { success: true };
            } else {
                toast.error(response.data.message || 'Login failed.');
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Authentication failed. Please verify credentials.';
            toast.error(msg);
            return { success: false, message: msg };
        }
    };

    const logoutAdmin = () => {
        setAdminToken('');
        setAdminUser(null);
        localStorage.removeItem('foodprep_admin_token');
        localStorage.removeItem('foodprep_admin_user');
        toast.info('Logged out from Admin Portal.');
    };

    const fetchMetrics = useCallback(async () => {
        if (!adminToken) return;
        setLoadingMetrics(true);
        try {
            const response = await axios.get(`${url}/api/order/metrics`, {
                headers: { token: adminToken }
            });
            if (response.data.success) {
                setMetrics(response.data.metrics);
            }
        } catch (error) {
            console.error('Error fetching admin metrics:', error);
        } finally {
            setLoadingMetrics(false);
        }
    }, [url, adminToken]);

    useEffect(() => {
        if (adminToken) {
            fetchMetrics();
        }
    }, [adminToken, fetchMetrics]);

    const contextValues = {
        url,
        adminToken,
        adminUser,
        isLoggedIn: !!adminToken,
        loginAdmin,
        logoutAdmin,
        metrics,
        loadingMetrics,
        fetchMetrics
    };

    return (
        <AdminContext.Provider value={contextValues}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
