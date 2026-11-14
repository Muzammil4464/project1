import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Cart from './screens/Cart/Cart';
import PlaceOrder from './screens/PlaceOrder/PlaceOrder';
import MyOrders from './screens/MyOrders/MyOrders';
import Home from './screens/Home/Home';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import ProfileModal from './components/ProfileModal/ProfileModal';
import FoodDetailModal from './components/FoodDetailModal/FoodDetailModal';
import ToastContainer from './components/Toast/Toast';
import './App.css';

const App = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    return (
        <div className="foodprep-application">
            {/* Notifications */}
            <ToastContainer />

            {/* Modals */}
            {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
            <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
            <FoodDetailModal />

            {/* Navigation Bar */}
            <Navbar
                setShowLogin={setShowLogin}
                openProfileModal={() => setShowProfile(true)}
            />

            {/* Main Application Viewport */}
            <main className="foodprep-main-root">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/cart"
                        element={
                            <div className="app-content-container">
                                <Cart />
                            </div>
                        }
                    />
                    <Route
                        path="/order"
                        element={
                            <div className="app-content-container">
                                <PlaceOrder setShowLogin={setShowLogin} />
                            </div>
                        }
                    />
                    <Route
                        path="/myorders"
                        element={
                            <div className="app-content-container">
                                <MyOrders setShowLogin={setShowLogin} />
                            </div>
                        }
                    />
                </Routes>
            </main>

            {/* Footer with preserved personal details */}
            <Footer />
        </div>
    );
};

export default App;