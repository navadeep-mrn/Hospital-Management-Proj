// DATABASE CONNECTION (MongoDB with Mongoose)
// This file connects the Express application to MongoDB using the Mongoose ODM.
// Mongoose simplifies database interactions by providing schemas, models, and
// built-in validation for our Hospital Management System.

const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(['1.1.1.1']);

const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI specified in the .env configuration file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        // If the database connection fails, log the error and terminate the process
        // because the application cannot function without database access.
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
