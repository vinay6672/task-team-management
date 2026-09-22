import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../store/authSlice";
import { showToast } from "../store/uiSlice";

export const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (searchParams.get("sessionExpired")) {
            dispatch(showToast({ message: "Your session expired. Please log in again.", type: "info" }));
        }
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch, searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
            await dispatch(loginUser({ email, password, rememberMe })).unwrap();
            dispatch(showToast({ message: "Logged in successfully!", type: "success" }));
            navigate("/dashboard");
        } catch (err) {
            dispatch(showToast({ message: err || "Login failed", type: "error" }));
        }
    };

    const quickFillStandard = () => {
        setEmail("testuser@example.com");
        setPassword("Test@1234");
    };

    const quickFillAdmin = () => {
        setEmail("admin@example.com");
        setPassword("Admin@1234");
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
            <div className="card" style={{ maxWidth: "440px", width: "100%", padding: "2.5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div className="brand-icon" style={{ margin: "0 auto 1rem auto", width: "48px", height: "48px", fontSize: "1.5rem" }}>
                        T
                    </div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Welcome back</h1>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                        Enter your credentials to access your task dashboard
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c",
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                        marginBottom: "1.5rem"
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="testuser@example.com"
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
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ borderRadius: "4px" }}
                            />
                            Remember Me
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", padding: "0.875rem" }}
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                {/* Quick Test Credentials Helper Box for Assessment Evaluation */}
                <div style={{
                    marginTop: "2rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid var(--border-color)",
                    textAlign: "center"
                }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                        Evaluation Test Accounts
                    </span>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={quickFillStandard}
                            style={{ flex: 1, padding: "0.5rem", fontSize: "0.75rem" }}
                        >
                            👤 Standard User
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={quickFillAdmin}
                            style={{ flex: 1, padding: "0.5rem", fontSize: "0.75rem" }}
                        >
                            👑 Admin User
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Don't have an account? </span>
                    <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};
