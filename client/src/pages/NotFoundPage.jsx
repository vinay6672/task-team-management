import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <div style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem"
        }}>
            <h1 style={{ fontSize: "5rem", fontWeight: 900, color: "var(--primary)", lineHeight: 1 }}>404</h1>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "1rem 0 0.5rem 0" }}>Page Not Found</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "400px" }}>
                The page you are looking for might have been removed, renamed, or does not exist.
            </p>
            <Link to="/dashboard" className="btn btn-primary">
                Return to Dashboard
            </Link>
        </div>
    );
};
