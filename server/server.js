const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect to MongoDB Atlas (with DNS setServers fix for querySrv ECONNREFUSED)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes (supporting both /api/... and direct /register, /tasks per specification)
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Mount top-level routes directly as specified in REST API sheet
app.use("/", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

// Root health check endpoint
app.get("/", (req, res) => {
    res.json({
        status: "Online",
        message: "Task & Team Management Platform API is running smoothly",
        endpoints: {
            auth: ["/register", "/login", "/api/auth/me"],
            tasks: ["/tasks", "/tasks/:id", "/tasks/stats/summary"],
            users: ["/users"]
        }
    });
});

// Handle 404 Resource Not Found
app.use((req, res, next) => {
    res.status(404).json({
        error: 404,
        message: `Resource not found: ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler caught:", err);
    res.status(err.status || 500).json({
        error: err.status || 500,
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});