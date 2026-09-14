// DOCTOR MODEL
// Extends the User model with doctor-specific medical attributes:
// specialization, qualification, years of experience, and weekly availability slots.
// Linking to the User model via ObjectId avoids duplicating login credentials.

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        // Reference to the main User document for login credentials and basic info
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // Medical department reference
        specialization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Specialization",
            required: [true, "Specialization is required"]
        },
        qualification: {
            type: String,
            required: [true, "Qualification is required (e.g. MBBS, MD)"]
        },
        experience: {
            type: Number,
            required: [true, "Years of experience is required"],
            min: [0, "Experience cannot be negative"]
        },
        // Weekly availability schedule for the next 7 days
        // e.g., [{ day: "Monday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] }]
        availability: [
            {
                day: {
                    type: String,
                    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                },
                isAvailable: {
                    type: Boolean,
                    default: true
                },
                slots: [
                    {
                        type: String // e.g. "10:00 AM - 01:00 PM"
                    }
                ]
            }
        ],
        // Quick toggle for emergency leaves or sabbatical
        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Doctor", doctorSchema);
