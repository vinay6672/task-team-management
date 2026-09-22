import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "../store/authSlice";
import { showToast } from "../store/uiSlice";

export const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError("");

        if (!firstName || !lastName || !email || !password) {
            setValidationError("All fields are required");
            return;
        }

        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setValidationError("Passwords do not match");
            return;
        }

        try {
            await dispatch(registerUser({ firstName, lastName, email, password })).unwrap();
            dispatch(showToast({ message: "Registration successful! Welcome to TaskFlow.", type: "success" }));
            navigate("/dashboard");
        } catch (err) {
            dispatch(showToast({ message: err || "Registration failed", type: "error" }));
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backgroundColor: "var(--bg-main)"
        }}>
            <div className="card" style={{ maxWidth: "480px", width: "100%", padding: "2.5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div className="brand-icon" style={{ margin: "0 auto 1rem auto", width: "48px", height: "48px", fontSize: "1.5rem" }}>
                        T
                    </div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Create an Account</h1>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        Join TaskFlow to manage tasks & collaborate with your team
                    </p>
                </div>

                {(error || validationError) && (
                    <div style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c",
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                        marginBottom: "1.5rem"
                    }}>
                        ⚠️ {validationError || error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="john.doe@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", padding: "0.875rem", marginTop: "0.5rem" }}
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Already have an account? </span>
                    <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};
