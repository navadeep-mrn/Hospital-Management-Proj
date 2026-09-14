// TREATMENT ROUTES
// Endpoints for saving clinical diagnosis/prescriptions and retrieving patient records.

const express = require("express");
const router = express.Router();
const {
    createTreatment,
    getTreatmentsByPatient,
    getTreatmentByAppointment
} = require("../controllers/treatmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Doctor only: Add treatment notes, diagnosis, and prescription for an appointment
router.post("/", protect, authorize("doctor"), createTreatment);

// Authenticated (Patient, Doctor, Admin): Get medical history for a patient
router.get("/patient/:patientId", protect, getTreatmentsByPatient);

// Authenticated: Get treatment record for a specific appointment
router.get("/appointment/:appointmentId", protect, getTreatmentByAppointment);

module.exports = router;
