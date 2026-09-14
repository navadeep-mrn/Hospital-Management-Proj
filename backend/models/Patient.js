// PATIENT MODEL
// Extends the User model with patient demographics such as age and gender.
// Linking to the User model maintains consistent authentication while keeping
// patient-specific clinical data cleanly organized.

const mongoose = require("mongoose");
const { isValidIndianPhone } = require("../utils/phone");

const patientSchema = new mongoose.Schema(
    {
        // Reference to the main User document for login credentials and basic info
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        age: {
            type: Number,
            required: [true, "Age is required"],
            min: [0, "Age cannot be negative"]
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: [true, "Gender is required"]
        },
        phone: {
            type: String,
            default: "",
            validate: [isValidIndianPhone, "Phone number must use the format +91 1111111111"]
        },
        address: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Patient", patientSchema);
