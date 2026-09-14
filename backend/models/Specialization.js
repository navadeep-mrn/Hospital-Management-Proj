// SPECIALIZATION MODEL
// Represents medical departments in the hospital (e.g., Cardiology, Dermatology).
// Patients can filter doctors by specialization, and Admins can manage them.

const mongoose = require("mongoose");

const specializationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Specialization name is required"],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Specialization", specializationSchema);
