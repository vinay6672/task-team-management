import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, resetFilters } from "../store/taskSlice";
import { openTaskModal } from "../store/uiSlice";
import { TaskFilterBar } from "../components/TaskFilterBar";
import { TaskCard } from "../components/TaskCard";

export const TaskListPage = () => {
    const dispatch = useDispatch();
    const { items: tasks, loading, filters } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks(filters));
    }, [dispatch, filters]);

    return (
        <div className="page-wrapper">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                        Task Management
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                        Search, filter, edit, and organize all team tasks in one place.
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => dispatch(openTaskModal(null))}
                >
                    + New Task
                </button>
            </div>

            {/* Filter & Search Bar */}
            <TaskFilterBar />

            {/* Task Grid */}
            {loading && tasks.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>Loading tasks from database...</p>
                </div>
            ) : tasks.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                        No matching tasks found
                    </h3>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                        Try adjusting your search query, status, or priority filters.
                    </p>
                    <button
                        className="btn btn-secondary"
                        onClick={() => dispatch(resetFilters())}
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="task-grid">
                    {tasks.map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
};
