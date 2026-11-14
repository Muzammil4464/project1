import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './Toast.css';

const ToastContainer = () => {
    const { toasts, removeToast } = useContext(StoreContext);

    if (!toasts || toasts.length === 0) return null;

    return (
        <div className="foodprep-toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`foodprep-toast foodprep-toast-${toast.type}`}>
                    <div className="toast-icon">
                        {toast.type === 'success' && '✓'}
                        {toast.type === 'error' && '✕'}
                        {toast.type === 'info' && 'ℹ'}
                        {toast.type === 'warning' && '⚠'}
                    </div>
                    <div className="toast-content">{toast.message}</div>
                    <button
                        className="toast-close"
                        onClick={() => removeToast(toast.id)}
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
