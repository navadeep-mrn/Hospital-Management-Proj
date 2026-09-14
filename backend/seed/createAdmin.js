// ==============================================================================
// AUTOMATIC ADMIN SEEDING SCRIPT
// ==============================================================================
// Called on backend startup.
// Checks whether an Admin account already exists in MongoDB.
// If no admin is found, it automatically creates the initial superuser.
// This ensures the application is ready to use immediately without requiring
// a public admin registration form (which would be a security risk in a real hospital).

const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdminIfNotExists = async () => {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || "admin@hospital.com").toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        // Check if an admin already exists in the system
        const existingAdmin = await User.findOne({ role: "admin" });

        if (!existingAdmin) {
            console.log("No administrator found. Creating initial admin account...");

            // Hash the admin's initial password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            await User.create({
                name: "Hospital Super Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                phone: "+91 1111111111",
                address: "Central Hospital Administration Wing",
                isActive: true
            });

            console.log("--------------------------------------------------");
            console.log("Default Admin created successfully!");
            console.log(`Email:    ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
            console.log("--------------------------------------------------");
        } else {
            console.log(`Administrator account verified (${existingAdmin.email})`);
        }
    } catch (error) {
        console.error("Error checking or creating initial admin account:", error.message);
    }
};

module.exports = createAdminIfNotExists;
