import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { toggleDarkMode, toggleSidebar, openTaskModal } from "../store/uiSlice";
import { getInitials } from "../utils/formatters";

export const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const darkMode = useSelector((state) => state.ui.darkMode);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="navbar">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                    className="btn-icon"
                    onClick={() => dispatch(toggleSidebar())}
                    aria-label="Toggle navigation drawer"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="navbar-brand">
                    <div className="brand-icon">T</div>
                    <span>TaskFlow</span>
                </div>
            </div>

            <div className="navbar-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => dispatch(openTaskModal(null))}
                    style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                >
                    + New Task
                </button>

                <button
                    className="btn-icon"
                    onClick={() => dispatch(toggleDarkMode())}
                    title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    style={{ fontSize: "1.2rem" }}
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>

                {user && (
                    <div className="user-profile-badge">
                        <div className="avatar">
                            {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                            <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                                {user.firstName} {user.lastName}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                                {user.role || "User"}
                            </span>
                        </div>
                        <button
                            className="btn-icon"
                            onClick={handleLogout}
                            title="Logout"
                            style={{ marginLeft: "0.5rem", color: "#ef4444" }}
                        >
                            🚪
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
