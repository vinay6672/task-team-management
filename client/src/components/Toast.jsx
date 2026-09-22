import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeToast } from "../store/uiSlice";

export const ToastContainer = () => {
    const toasts = useSelector((state) => state.ui.toasts);
    const dispatch = useDispatch();

    if (!toasts.length) return null;

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <div style={{ flex: 1, fontSize: "0.875rem", fontWeight: 500 }}>
                        {toast.message}
                    </div>
                    <button
                        className="btn-icon"
                        onClick={() => dispatch(removeToast(toast.id))}
                        aria-label="Close notification"
                        style={{ padding: 2 }}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};
