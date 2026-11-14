import React, { createContext, useState, useEffect, useCallback } from 'react';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    // API URL configuration with dynamic environment fallback
    const url = import.meta.env.VITE_API_URL || (
        typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:4000'
            : 'https://food-delivery-backend-5b6g.onrender.com'
    );

    // State definitions
    const [food_list, setFoodList] = useState([]);
    const [loadingFoods, setLoadingFoods] = useState(true);
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('foodprep_cart');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem('foodprep_token') || '');
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('foodprep_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const [selectedFood, setSelectedFood] = useState(null);
    const [toasts, setToasts] = useState([]);

    // Toast manager
    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random().toString(36).substring(2, 6);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Fetch food list from backend
    const fetchFoodList = useCallback(async () => {
        setLoadingFoods(true);
        try {
            const response = await fetch(`${url}/api/food/list`);
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setFoodList(data.data);
            } else if (Array.isArray(data.data)) {
                setFoodList(data.data);
            }
        } catch (error) {
            console.error('Error fetching food list:', error);
            addToast('Could not load menu items. Retrying...', 'error');
        } finally {
            setLoadingFoods(false);
        }
    }, [url, addToast]);

    // Fetch user cart from backend when logged in
    const loadCartData = useCallback(async (userToken) => {
        try {
            const response = await fetch(`${url}/api/cart/get`, {
                headers: { token: userToken }
            });
            const data = await response.json();
            if (data.success && data.cartData) {
                setCartItems(data.cartData);
                localStorage.setItem('foodprep_cart', JSON.stringify(data.cartData));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }, [url]);

    // Initial load
    useEffect(() => {
        fetchFoodList();
        if (token) {
            loadCartData(token);
        }
    }, [fetchFoodList, loadCartData, token]);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('foodprep_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Cart management
    const addToCart = async (itemId, qty = 1) => {
        const food = food_list.find((f) => f._id === itemId);
        setCartItems((prev) => {
            const currentQty = prev[itemId] || 0;
            return { ...prev, [itemId]: currentQty + qty };
        });

        if (token) {
            try {
                await fetch(`${url}/api/cart/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token
                    },
                    body: JSON.stringify({ itemId })
                });
            } catch (err) {
                console.error('Cart sync error:', err);
            }
        }

        if (food) {
            addToast(`Added "${food.name}" to your cart!`, 'success');
        }
    };

    const removeFromCart = async (itemId) => {
        const food = food_list.find((f) => f._id === itemId);
        setCartItems((prev) => {
            const currentQty = prev[itemId] || 0;
            if (currentQty <= 1) {
                const next = { ...prev };
                delete next[itemId];
                return next;
            }
            return { ...prev, [itemId]: currentQty - 1 };
        });

        if (token) {
            try {
                await fetch(`${url}/api/cart/remove`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        token
                    },
                    body: JSON.stringify({ itemId })
                });
            } catch (err) {
                console.error('Cart remove sync error:', err);
            }
        }

        if (food) {
            addToast(`Updated "${food.name}" quantity.`, 'info');
        }
    };

    const clearCart = async () => {
        setCartItems({});
        localStorage.removeItem('foodprep_cart');
        if (token) {
            try {
                await fetch(`${url}/api/cart/clear`, {
                    method: 'POST',
                    headers: { token }
                });
            } catch (err) {
                console.error('Clear cart error:', err);
            }
        }
    };

    const getTotalCartAmount = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((food) => food._id === item);
                if (itemInfo && itemInfo.price) {
                    total += itemInfo.price * cartItems[item];
                }
            }
        }
        return total;
    };

    const getTotalCartItems = () => {
        let count = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                count += cartItems[item];
            }
        }
        return count;
    };

    // User session handling
    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('foodprep_token', newToken);
        localStorage.setItem('foodprep_user', JSON.stringify(userData));
        loadCartData(newToken);
        addToast(`Welcome back, ${userData?.name || 'Foodie'}!`, 'success');
    };

    const logout = () => {
        setToken('');
        setUser(null);
        setCartItems({});
        localStorage.removeItem('foodprep_token');
        localStorage.removeItem('foodprep_user');
        localStorage.removeItem('foodprep_cart');
        addToast('You have been logged out successfully.', 'info');
    };

    const updateUserState = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('foodprep_user', JSON.stringify(updatedUser));
    };

    const contextValues = {
        url,
        food_list,
        loadingFoods,
        fetchFoodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        getTotalCartItems,
        token,
        user,
        login,
        logout,
        updateUserState,
        searchQuery,
        setSearchQuery,
        category,
        setCategory,
        sortBy,
        setSortBy,
        selectedFood,
        setSelectedFood,
        toasts,
        addToast,
        removeToast
    };

    return (
        <StoreContext.Provider value={contextValues}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;