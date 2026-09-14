// APPOINTMENT MODEL
// Connects a Patient with a Doctor on a specific date and time slot.
// Supports three lifecycle statuses:
// 1. "Booked"    - Active appointment waiting to happen
// 2. "Completed" - Successfully attended; doctor added treatment/prescription
// 3. "Cancelled" - Cancelled by patient, doctor, or hospital admin

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        // The patient who booked this appointment
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        // The doctor assigned to examine the patient
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        // Appointment date stored as "YYYY-MM-DD" string for reliable timezone-safe comparisons
        date: {
            type: String,
            required: [true, "Appointment date is required"]
        },
        // Selected consultation time slot (e.g., "10:00 AM" or "10:00 AM - 11:00 AM")
        time: {
            type: String,
            required: [true, "Appointment time slot is required"]
        },
        // Lifecycle status of the consultation
        status: {
            type: String,
            enum: ["Booked", "Completed", "Cancelled"],
            default: "Booked"
        },
        // Primary reason or symptoms described by the patient
        reason: {
            type: String,
            required: [true, "Reason for appointment is required"],
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Helpful index to speed up conflict checking and prevent slow queries during double booking checks
appointmentSchema.index({ doctor: 1, date: 1, time: 1, status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
