import React from "react";
import { useDispatch } from "react-redux";
import { openTaskModal, showToast } from "../store/uiSlice";
import { deleteExistingTask, updateExistingTask } from "../store/taskSlice";
import { formatDate, getInitials, getStatusBadgeClass, getPriorityBadgeClass } from "../utils/formatters";

export const TaskCard = ({ task }) => {
    const dispatch = useDispatch();

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            await dispatch(updateExistingTask({ id: task._id, taskData: { status: newStatus } })).unwrap();
            dispatch(showToast({ message: `Status updated to "${newStatus}"`, type: "success" }));
        } catch (err) {
            dispatch(showToast({ message: err || "Failed to update status", type: "error" }));
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
            try {
                await dispatch(deleteExistingTask(task._id)).unwrap();
                dispatch(showToast({ message: "Task deleted successfully", type: "info" }));
            } catch (err) {
                dispatch(showToast({ message: err || "Failed to delete task", type: "error" }));
            }
        }
    };

    const assigned = task.assignedUser || {};

    return (
        <div className="card task-card">
            <div>
                <div className="task-card-header">
                    <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                        ● {task.priority} Priority
                    </span>

                    <select
                        className={`badge ${getStatusBadgeClass(task.status)}`}
                        value={task.status}
                        onChange={handleStatusChange}
                        style={{ border: "none", cursor: "pointer", outline: "none" }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">
                    {task.description || "No description provided."}
                </p>
            </div>

            <div className="task-footer">
                <div className="assigned-user-info">
                    <div className="avatar" style={{ width: 26, height: 26, fontSize: "0.75rem" }}>
                        {getInitials(assigned.firstName, assigned.lastName)}
                    </div>
                    <span>
                        {assigned.firstName ? `${assigned.firstName} ${assigned.lastName || ""}` : "Unassigned"}
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        📅 {formatDate(task.dueDate)}
                    </span>
                    <button
                        className="btn-icon"
                        onClick={() => dispatch(openTaskModal(task))}
                        title="Edit Task"
                    >
                        ✏️
                    </button>
                    <button
                        className="btn-icon"
                        onClick={handleDelete}
                        title="Delete Task"
                        style={{ color: "#ef4444" }}
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
};
