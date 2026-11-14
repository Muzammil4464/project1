import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AdminContextProvider } from './context/AdminContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AdminContextProvider>
            <App />
        </AdminContextProvider>
    </BrowserRouter>
);
