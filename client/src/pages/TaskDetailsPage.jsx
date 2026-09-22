import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { taskService } from "../services/taskService";
import { openTaskModal, showToast } from "../store/uiSlice";
import { formatDate, getInitials, getStatusBadgeClass, getPriorityBadgeClass } from "../utils/formatters";

export const TaskDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        taskService.getTaskById(id)
            .then((res) => {
                setTask(res.task);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Task not found");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
                    <p>Loading task details...</p>
                </div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="page-wrapper">
                <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
                    <h2>Task Not Found</h2>
                    <p style={{ color: "var(--text-secondary)", margin: "1rem 0" }}>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate("/tasks")}>
                        Back to Tasks
                    </button>
                </div>
            </div>
        );
    }

    const assigned = task.assignedUser || {};
    const creator = task.createdBy || {};

    return (
        <div className="page-wrapper" style={{ maxWidth: "800px" }}>
            <button
                className="btn btn-secondary"
                onClick={() => navigate("/tasks")}
                style={{ marginBottom: "1.5rem" }}
            >
                ← Back to Tasks
            </button>

            <div className="card">
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
                    <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                        {task.priority} Priority
                    </span>
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                        {task.status}
                    </span>
                </div>

                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem" }}>
                    {task.title}
                </h1>

                <div style={{
                    padding: "1.25rem",
                    backgroundColor: "var(--bg-main)",
                    borderRadius: "0.75rem",
                    marginBottom: "1.5rem",
                    lineHeight: 1.6,
                    color: "var(--text-secondary)"
                }}>
                    {task.description || "No description provided."}
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1.25rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid var(--border-color)"
                }}>
                    <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                            Assigned To
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
                            <div className="avatar">
                                {getInitials(assigned.firstName, assigned.lastName)}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                                    {assigned.firstName ? `${assigned.firstName} ${assigned.lastName || ""}` : "Unassigned"}
                                </div>
                                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                                    {assigned.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                            Created By
                        </span>
                        <div style={{ marginTop: "0.5rem", fontWeight: 600, fontSize: "0.9375rem" }}>
                            {creator.firstName ? `${creator.firstName} ${creator.lastName || ""}` : "System"}
                        </div>
                    </div>

                    <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                            Due Date
                        </span>
                        <div style={{ marginTop: "0.5rem", fontWeight: 600, fontSize: "0.9375rem" }}>
                            📅 {formatDate(task.dueDate)}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => dispatch(openTaskModal(task))}
                    >
                        Edit Task
                    </button>
                </div>
            </div>
        </div>
    );
};
