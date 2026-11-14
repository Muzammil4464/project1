import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './screens/Dashboard/Dashboard';
import Add from './screens/Add/Add';
import List from './screens/List/List';
import Orders from './screens/Orders/Orders';
import AdminLogin from './screens/Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import './App.css';

const App = () => {
    const { isLoggedIn } = useContext(AdminContext);

    if (!isLoggedIn) {
        return (
            <div className="admin-app-root">
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/login" element={<AdminLogin />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        );
    }

    return (
        <div className="admin-app-root">
            <ToastContainer position="top-right" autoClose={3000} />
            <Navbar />
            <div className="admin-layout-content">
                <Sidebar />
                <main className="admin-main-viewport">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/add" element={<Add />} />
                        <Route path="/list" element={<List />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default App;