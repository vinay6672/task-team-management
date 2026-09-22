const mongoose = require("mongoose");
const dns = require("dns");

// Set custom DNS resolvers to fix querySrv ECONNREFUSED issues on ISP networks
try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (dnsErr) {
    console.warn("Could not set custom DNS servers:", dnsErr.message);
}

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`✅ MongoDB Atlas connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.warn("\n=================================================================");
        console.warn("⚠️  MONGODB ATLAS CONNECTION / WHITELIST ALERT");
        console.warn("Could not connect to MongoDB Atlas cluster.");
        console.warn("Error message:", error.message);
        console.warn("\nTo fix this:");
        console.warn("1. Go to https://cloud.mongodb.com/");
        console.warn("2. Click 'Network Access' -> 'Add IP Address'");
        console.warn("3. Click 'Allow Access From Anywhere' (0.0.0.0/0) -> Save.");
        console.warn("=================================================================\n");

        // Optional In-Memory fallback if mongodb-memory-server is installed
        try {
            const memoryServerModule = "mongodb-memory-server";
            const { MongoMemoryServer } = require(memoryServerModule);
            console.log("🔄 Starting local In-Memory MongoDB server fallback...");
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();

            await mongoose.connect(memoryUri);
            console.log("✅ In-Memory MongoDB connected successfully!");
        } catch (fallbackError) {
            console.error("Please add your IP address to MongoDB Atlas Network Access (0.0.0.0/0) and restart.");
            process.exit(1);
        }
    }
};

module.exports = connectDB;