// TREATMENT CONTROLLER
// Manages clinical diagnoses, prescriptions, and medical consultation notes.
// When a doctor completes an appointment, they record diagnosis and prescription,
// which simultaneously marks the appointment as "Completed" and saves the record
// to the patient's permanent medical history.

const Treatment = require("../models/Treatment");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// @desc    Add treatment details (diagnosis, prescription, notes) for an appointment
// @route   POST /api/treatments
// @access  Private/Doctor
const createTreatment = async (req, res) => {
    try {
        const { appointmentId, diagnosis, prescription, notes } = req.body;

        if (!appointmentId || !diagnosis || !prescription) {
            return res.status(400).json({ message: "Please provide appointment, diagnosis, and prescription" });
        }

        // Fetch the corresponding appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Get doctor profile of currently logged-in doctor
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            return res.status(403).json({ message: "Only registered doctors can create treatment records" });
        }

        // Check whether a treatment has already been added for this appointment
        const existingTreatment = await Treatment.findOne({ appointment: appointmentId });
        if (existingTreatment) {
            return res.status(400).json({ message: "Treatment record has already been created for this appointment" });
        }

        // Create the treatment record
        const treatment = await Treatment.create({
            appointment: appointment._id,
            patient: appointment.patient,
            doctor: doctor._id,
            diagnosis,
            prescription,
            notes: notes || ""
        });

        // Automatically mark the appointment status as "Completed"
        appointment.status = "Completed";
        await appointment.save();

        const populatedTreatment = await Treatment.findById(treatment._id)
            .populate({
                path: "doctor",
                populate: [
                    { path: "user", select: "name email phone" },
                    { path: "specialization", select: "name" }
                ]
            })
            .populate("appointment");

        res.status(201).json({
            message: "Treatment record saved and appointment marked as completed!",
            treatment: populatedTreatment
        });
    } catch (error) {
        console.error("Create treatment error:", error);
        res.status(500).json({ message: "Error creating treatment record: " + error.message });
    }
};

// @desc    Get complete treatment history for a patient
// @route   GET /api/treatments/patient/:patientId
// @access  Private (Patient, Doctor, Admin)
const getTreatmentsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        const treatments = await Treatment.find({ patient: patientId })
            .populate({
                path: "doctor",
                populate: [
                    { path: "user", select: "name email phone" },
                    { path: "specialization", select: "name" }
                ]
            })
            .populate("appointment")
            .sort({ createdAt: -1 });

        res.json(treatments);
    } catch (error) {
        console.error("Get patient treatments error:", error);
        res.status(500).json({ message: "Error fetching treatment history: " + error.message });
    }
};

// @desc    Get treatment record for a specific appointment
// @route   GET /api/treatments/appointment/:appointmentId
// @access  Private
const getTreatmentByAppointment = async (req, res) => {
    try {
        const treatment = await Treatment.findOne({ appointment: req.params.appointmentId })
            .populate({
                path: "doctor",
                populate: [
                    { path: "user", select: "name email phone" },
                    { path: "specialization", select: "name" }
                ]
            })
            .populate("appointment");

        if (!treatment) {
            return res.status(404).json({ message: "No treatment record found for this appointment" });
        }

        res.json(treatment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching treatment details: " + error.message });
    }
};

module.exports = {
    createTreatment,
    getTreatmentsByPatient,
    getTreatmentByAppointment
};
