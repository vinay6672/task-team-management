import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats, fetchTasks } from "../store/taskSlice";
import { openTaskModal } from "../store/uiSlice";
import { DashboardCards } from "../components/DashboardCards";
import { TaskCharts } from "../components/TaskCharts";
import { TaskCard } from "../components/TaskCard";

export const DashboardPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: tasks, loading } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchTasks({ limit: 6 }));
    }, [dispatch]);

    return (
        <div className="page-wrapper">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                        Welcome back, {user?.firstName || "Team Member"} 👋
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                        Here is an overview of your team's tasks and overall progress.
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => dispatch(openTaskModal(null))}
                >
                    + Create Task
                </button>
            </div>

            {/* Core Metric Cards */}
            <DashboardCards />

            {/* Visual Analytics & Breakdown */}
            <TaskCharts />

            {/* Recent Activity / Recent Tasks */}
            <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Recent Tasks</h2>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                        Showing latest updates
                    </span>
                </div>

                {loading && tasks.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <p style={{ color: "var(--text-muted)" }}>Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>No tasks created yet.</p>
                        <button className="btn btn-primary" onClick={() => dispatch(openTaskModal(null))}>
                            Create First Task
                        </button>
                    </div>
                ) : (
                    <div className="task-grid">
                        {tasks.slice(0, 6).map((task) => (
                            <TaskCard key={task._id} task={task} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
