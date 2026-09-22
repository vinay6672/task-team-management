const Task = require("../models/Task");
const User = require("../models/User");

// @route   GET /api/tasks (and GET /tasks)
// @desc    Get all tasks with search, filter, and sort options
// @access  Private
const getTasks = async (req, res) => {
    try {
        const { search, status, priority, sort, page = 1, limit = 50 } = req.query;

        let query = {};

        // Search by title or description
        if (search && search.trim() !== "") {
            query.title = { $regex: search.trim(), $options: "i" };
        }

        // Filter by status
        if (status && status !== "All") {
            query.status = status;
        }

        // Filter by priority
        if (priority && priority !== "All") {
            query.priority = priority;
        }

        // Sort options (default: newest due date or creation date)
        let sortOption = { createdAt: -1 };
        if (sort === "dueDateAsc") {
            sortOption = { dueDate: 1 };
        } else if (sort === "dueDateDesc") {
            sortOption = { dueDate: -1 };
        } else if (sort === "priority") {
            sortOption = { priority: -1 };
        } else if (sort === "asc") {
            sortOption = { createdAt: 1 };
        } else if (sort === "desc") {
            sortOption = { createdAt: -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const tasks = await Task.find(query)
            .populate("assignedUser", "firstName lastName email role")
            .populate("createdBy", "firstName lastName email")
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const totalTasks = await Task.countDocuments(query);

        res.json({
            success: true,
            count: tasks.length,
            totalTasks,
            page: parseInt(page),
            pages: Math.ceil(totalTasks / parseInt(limit)),
            tasks
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server error fetching tasks: " + error.message });
    }
};

// @route   GET /api/tasks/:id (and GET /tasks/:id)
// @desc    Get single task by ID
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedUser", "firstName lastName email role")
            .populate("createdBy", "firstName lastName email");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ success: true, task });
    } catch (error) {
        console.error("Error fetching task:", error);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Task not found (invalid ID format)" });
        }
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// @route   POST /api/tasks (and POST /tasks)
// @desc    Create a new task
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, status, assignedUser } = req.body;

        if (!title || !assignedUser) {
            return res.status(400).json({ message: "Title and assigned user are required" });
        }

        // Validate assigned user exists
        const userExists = await User.findById(assignedUser);
        if (!userExists) {
            return res.status(400).json({ message: "Assigned user does not exist" });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description ? description.trim() : "",
            priority: priority || "Medium",
            status: status || "Pending",
            dueDate: dueDate ? new Date(dueDate) : undefined,
            assignedUser,
            createdBy: req.user._id
        });

        const populatedTask = await Task.findById(task._id)
            .populate("assignedUser", "firstName lastName email role")
            .populate("createdBy", "firstName lastName email");

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: populatedTask
        });
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(400).json({ message: "Invalid task data: " + error.message });
    }
};

// @route   PUT /api/tasks/:id (and PUT /tasks/:id)
// @desc    Update task by ID
// @access  Private
const updateTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, status, assignedUser } = req.body;

        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (assignedUser) {
            const userExists = await User.findById(assignedUser);
            if (!userExists) {
                return res.status(400).json({ message: "Assigned user does not exist" });
            }
        }

        task.title = title !== undefined ? title.trim() : task.title;
        task.description = description !== undefined ? description.trim() : task.description;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.dueDate = dueDate ? new Date(dueDate) : task.dueDate;
        if (assignedUser) task.assignedUser = assignedUser;

        const updatedTask = await task.save();

        const populatedTask = await Task.findById(updatedTask._id)
            .populate("assignedUser", "firstName lastName email role")
            .populate("createdBy", "firstName lastName email");

        res.json({
            success: true,
            message: "Task updated successfully",
            task: populatedTask
        });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(400).json({ message: "Task update failed: " + error.message });
    }
};

// @route   DELETE /api/tasks/:id (and DELETE /tasks/:id)
// @desc    Delete task by ID
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Task deleted successfully",
            taskId: req.params.id
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Server error deleting task: " + error.message });
    }
};

// @route   GET /api/tasks/stats/summary
// @desc    Get metric statistics for dashboard cards
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const pending = await Task.countDocuments({ status: "Pending" });
        const inProgress = await Task.countDocuments({ status: "In Progress" });
        const completed = await Task.countDocuments({ status: "Completed" });

        const lowPriority = await Task.countDocuments({ priority: "Low" });
        const mediumPriority = await Task.countDocuments({ priority: "Medium" });
        const highPriority = await Task.countDocuments({ priority: "High" });

        res.json({
            success: true,
            stats: {
                totalTasks,
                pending,
                inProgress,
                completed,
                priorityBreakdown: {
                    low: lowPriority,
                    medium: mediumPriority,
                    high: highPriority
                }
            }
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Server error fetching stats: " + error.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getDashboardStats
};
