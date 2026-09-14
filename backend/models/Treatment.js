// TREATMENT MODEL
// Records clinical outcomes when an appointment is completed by a Doctor.
// Stores the medical diagnosis, prescribed medications, and doctor's advice.
// Patients can view these records in their Medical History, and Doctors can
// review them to understand the patient's prior medical care.

const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
    {
        // Reference to the specific appointment that led to this treatment record
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true
        },
        // The patient who received the treatment
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        // The doctor who diagnosed and treated the patient
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        // Clinical diagnosis determined by the doctor
        diagnosis: {
            type: String,
            required: [true, "Diagnosis is required"],
            trim: true
        },
        // Medicines, dosages, and instructions
        prescription: {
            type: String,
            required: [true, "Prescription details are required"],
            trim: true
        },
        // Additional medical advice, follow-up instructions, or diet notes
        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Treatment", treatmentSchema);
