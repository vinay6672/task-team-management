import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store/store";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TaskListPage } from "./pages/TaskListPage";
import { TaskDetailsPage } from "./pages/TaskDetailsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ToastContainer } from "./components/Toast";
import { TaskModal } from "./components/TaskModal";
import { ProtectedRoute } from "./components/ProtectedRoute";

import "./App.css";

const AppContent = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const darkMode = useSelector((state) => state.ui.darkMode);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <Router>
            <div className="app-container">
                {isAuthenticated && <Sidebar />}

                <div className="main-content">
                    {isAuthenticated && <Navbar />}

                    <main style={{ flex: 1 }}>
                        <Routes>
                            {/* Public Auth Routes */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />

                            {/* Protected Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/tasks" element={<TaskListPage />} />
                                <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                                <Route path="/analytics" element={<AnalyticsPage />} />
                            </Route>

                            {/* 404 Catch-All */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </main>
                </div>
            </div>

            {/* Global Overlays */}
            <ToastContainer />
            <TaskModal />
        </Router>
    );
};

function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;
