import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarOpen } from "../store/uiSlice";

export const Sidebar = () => {
    const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
    const dispatch = useDispatch();

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            dispatch(setSidebarOpen(false));
        }
    };

    return (
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Navigation
                </span>
            </div>

            <nav style={{ display: "flex", flexDirection: "column" }}>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    onClick={handleLinkClick}
                >
                    <span>📊</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/tasks"
                    className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    onClick={handleLinkClick}
                >
                    <span>📋</span>
                    <span>Tasks</span>
                </NavLink>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    onClick={handleLinkClick}
                >
                    <span>📈</span>
                    <span>Analytics</span>
                </NavLink>
            </nav>

            <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid var(--border-color)" }}>
                <div className="card" style={{ padding: "1rem", backgroundColor: "var(--primary-light)", borderColor: "transparent" }}>
                    <h5 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.25rem" }}>
                        Task Platform
                    </h5>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        Full Stack Intern Assessment Platform
                    </p>
                </div>
            </div>
        </aside>
    );
};
