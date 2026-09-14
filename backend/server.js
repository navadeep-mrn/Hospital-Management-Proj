// HOSPITAL MANAGEMENT SYSTEM - BACKEND SERVER
// Main entry point for the Express.js server.
// - Configures environment variables and connects to MongoDB.
// - Automatically checks and initializes the default Admin user.
// - Mounts RESTful API routes for authentication, doctors, patients, appointments,
//   treatments, specializations, and dashboard analytics.

require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const createAdminIfNotExists = require("./seed/createAdmin");
const seedInitialData = require("./seed/seedData");

// Initialize Express application
const app = express();

// Middleware: Enable Cross-Origin Resource Sharing (allows frontend to call backend API)
app.use(cors());

// Middleware: Parse incoming JSON request payloads
app.use(express.json());

// Mount REST API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/treatments", require("./routes/treatmentRoutes"));
app.use("/api/specializations", require("./routes/specializationRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Base Health Check endpoint
app.get("/api", (req, res) => {
    res.json({
        message: "Hospital Management System API is running smoothly",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

// Global Error Handler Middleware
// Catches unexpected errors in Express routes and returns a clean JSON response
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});
// Server Startup and Initialization
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // 1. Connect to MongoDB database
        await connectDB();

        // 2. Populate the initial catalog and demo records on a fresh database
        await seedInitialData();

        // 3. Automatically create initial Admin if one doesn't exist
        await createAdminIfNotExists();

        // 4. Start listening for incoming HTTP requests
        app.listen(PORT, () => {
            console.log(`==================================================`);
            console.log(`HMS Backend Server running on port ${PORT}`);
            console.log(`API URL: http://localhost:${PORT}/api`);
            console.log(`==================================================`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
