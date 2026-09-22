const User = require("../models/User");

// @route   GET /api/users
// @desc    Get all registered users (for task assignment)
// @access  Private
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ firstName: 1 });
        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error fetching team members: " + error.message });
    }
};

module.exports = {
    getUsers
};
