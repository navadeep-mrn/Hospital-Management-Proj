// USER MODEL
// Represents all system accounts across the three roles: Admin, Doctor, Patient.
// Centralizing basic auth fields (name, email, password, role) in one collection
// makes authentication and JWT token generation simple and consistent.

const mongoose = require("mongoose");
const { isValidIndianPhone } = require("../utils/phone");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },
        role: {
            type: String,
            enum: ["admin", "doctor", "patient"],
            default: "patient"
        },
        phone: {
            type: String,
            default: "",
            validate: [isValidIndianPhone, "Phone number must use the format +91 1111111111"]
        },
        address: {
            type: String,
            default: ""
        },
        // Admin can deactivate/block users without deleting their historical records
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
