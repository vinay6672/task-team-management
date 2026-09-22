const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");
require("dotenv").config();

const User = require("./models/User");
const Task = require("./models/Task");

// DNS resolver fix for querySrv ECONNREFUSED
try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
    console.warn("DNS setServers warning:", e.message);
}

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB Atlas for seeding...");
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("Connected to MongoDB Atlas.");

        // Clear existing records
        await User.deleteMany({});
        await Task.deleteMany({});
        console.log("Cleared existing users and tasks.");

        // Hash passwords
        const userPasswordHash = await bcrypt.hash("Test@1234", 10);
        const adminPasswordHash = await bcrypt.hash("Admin@1234", 10);

        // Create test users specified in evaluation criteria
        const testUser = await User.create({
            firstName: "Standard",
            lastName: "Tester",
            email: "testuser@example.com",
            password: userPasswordHash,
            role: "user"
        });

        const adminUser = await User.create({
            firstName: "Admin",
            lastName: "Manager",
            email: "admin@example.com",
            password: adminPasswordHash,
            role: "admin"
        });

        const devUser = await User.create({
            firstName: "Alex",
            lastName: "Developer",
            email: "alex.dev@example.com",
            password: userPasswordHash,
            role: "user"
        });

        console.log("\n=============================================");
        console.log("✅ SEEDED TEST ACCOUNTS IN ATLAS:");
        console.log(" Standard User -> testuser@example.com / Test@1234");
        console.log(" Admin User    -> admin@example.com / Admin@1234");
        console.log(" Dev User      -> alex.dev@example.com / Test@1234");
        console.log("=============================================\n");

        // Create sample tasks
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const pastDate = new Date(today);
        pastDate.setDate(pastDate.getDate() - 2);

        const sampleTasks = [
            {
                title: "Design Responsive Dashboard Wireframes",
                description: "Create sleek dark/light mode wireframes for the task management dashboard layout.",
                priority: "High",
                status: "Completed",
                dueDate: pastDate,
                assignedUser: testUser._id,
                createdBy: adminUser._id
            },
            {
                title: "Implement JWT Authentication & Refresh Flow",
                description: "Setup JWT access tokens, password hashing with bcrypt, and login/register endpoints.",
                priority: "High",
                status: "Completed",
                dueDate: today,
                assignedUser: adminUser._id,
                createdBy: adminUser._id
            },
            {
                title: "Optimize MongoDB DNS & Database Connection",
                description: "Configure custom DNS resolvers to resolve querySrv ECONNREFUSED issues on ISP networks.",
                priority: "Medium",
                status: "In Progress",
                dueDate: tomorrow,
                assignedUser: testUser._id,
                createdBy: adminUser._id
            },
            {
                title: "Integrate Real-Time Task Search & Status Filters",
                description: "Build client-side debounced search bar and status/priority dropdown filters.",
                priority: "High",
                status: "In Progress",
                dueDate: nextWeek,
                assignedUser: devUser._id,
                createdBy: testUser._id
            },
            {
                title: "Conduct End-to-End API Security Audit",
                description: "Verify protected routes, request validation, and proper error handling for 400/401/404 responses.",
                priority: "Low",
                status: "Pending",
                dueDate: nextWeek,
                assignedUser: adminUser._id,
                createdBy: adminUser._id
            },
            {
                title: "Write Comprehensive README & API Documentation",
                description: "Document local setup instructions, API endpoints, test credentials, and architecture overview.",
                priority: "Medium",
                status: "Pending",
                dueDate: nextWeek,
                assignedUser: testUser._id,
                createdBy: testUser._id
            }
        ];

        await Task.insertMany(sampleTasks);
        console.log(`Successfully seeded ${sampleTasks.length} sample tasks.`);
        process.exit(0);
    } catch (error) {
        console.warn("\n=================================================================");
        console.warn("⚠️  MONGODB ATLAS WHITELIST INSTRUCTIONS");
        console.warn("Seeding Atlas failed because your IP address is not whitelisted yet.");
        console.warn("To whitelist your IP in MongoDB Atlas:");
        console.warn("1. Go to https://cloud.mongodb.com/");
        console.warn("2. Go to Security -> Network Access");
        console.warn("3. Click 'Add IP Address' -> 'Allow Access From Anywhere' (0.0.0.0/0)");
        console.warn("4. Click Confirm.");
        console.warn("=================================================================\n");
        process.exit(1);
    }
};

seedDatabase();
