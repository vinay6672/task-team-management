const express = require("express");
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getDashboardStats
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All task routes require JWT protection
router.use(protect);

router.get("/stats/summary", getDashboardStats);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
