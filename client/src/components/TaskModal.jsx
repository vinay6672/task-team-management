import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeTaskModal, showToast } from "../store/uiSlice";
import { addNewTask, updateExistingTask } from "../store/taskSlice";
import { userService } from "../services/userService";

export const TaskModal = () => {
    const dispatch = useDispatch();
    const { taskModalOpen, editingTask } = useSelector((state) => state.ui);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [status, setStatus] = useState("Pending");
    const [dueDate, setDueDate] = useState("");
    const [assignedUser, setAssignedUser] = useState("");

    const [users, setUsers] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Load team users for assigned user dropdown
    useEffect(() => {
        if (taskModalOpen) {
            userService.getUsers()
                .then((res) => {
                    if (res.users) {
                        setUsers(res.users);
                        if (!editingTask && res.users.length > 0) {
                            setAssignedUser(res.users[0]._id);
                        }
                    }
                })
                .catch((err) => console.error("Error fetching users:", err));
        }
    }, [taskModalOpen, editingTask]);

    // Populate form if editing
    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title || "");
            setDescription(editingTask.description || "");
            setPriority(editingTask.priority || "Medium");
            setStatus(editingTask.status || "Pending");
            setDueDate(editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : "");
            setAssignedUser(editingTask.assignedUser?._id || editingTask.assignedUser || "");
        } else {
            setTitle("");
            setDescription("");
            setPriority("Medium");
            setStatus("Pending");
            setDueDate("");
            if (users.length > 0) setAssignedUser(users[0]._id);
        }
        setFormError("");
    }, [editingTask, taskModalOpen, users]);

    if (!taskModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!title.trim()) {
            setFormError("Task title is required");
            return;
        }

        if (!assignedUser) {
            setFormError("Please select an assigned team member");
            return;
        }

        setSubmitting(true);

        const taskPayload = {
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            dueDate: dueDate || null,
            assignedUser
        };

        try {
            if (editingTask) {
                await dispatch(updateExistingTask({ id: editingTask._id, taskData: taskPayload })).unwrap();
                dispatch(showToast({ message: "Task updated successfully", type: "success" }));
            } else {
                await dispatch(addNewTask(taskPayload)).unwrap();
                dispatch(showToast({ message: "Task created successfully", type: "success" }));
            }
            dispatch(closeTaskModal());
        } catch (err) {
            setFormError(err || "Failed to save task");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={() => dispatch(closeTaskModal())}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                        {editingTask ? "Edit Task" : "Create New Task"}
                    </h2>
                    <button className="btn-icon" onClick={() => dispatch(closeTaskModal())}>✕</button>
                </div>

                {formError && (
                    <div style={{
                        padding: "0.75rem 1rem",
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        marginBottom: "1rem"
                    }}>
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Task Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Design API architecture"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            rows="3"
                            placeholder="Add task details, acceptance criteria, or context..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select
                                className="form-select"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Assigned User *</label>
                            <select
                                className="form-select"
                                value={assignedUser}
                                onChange={(e) => setAssignedUser(e.target.value)}
                                required
                            >
                                {users.length === 0 && <option value="">Loading team members...</option>}
                                {users.map((u) => (
                                    <option key={u._id} value={u._id}>
                                        {u.firstName} {u.lastName} ({u.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => dispatch(closeTaskModal())}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
