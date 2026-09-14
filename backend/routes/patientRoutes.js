// ==============================================================================
// PATIENT ROUTES
// ==============================================================================
// Endpoints for patient management, searching patient records, and updating demographics.

const express = require("express");
const router = express.Router();
const {
    getAllPatients,
    getPatientById,
    updatePatientProfile,
    togglePatientStatus
} = require("../controllers/patientController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Admin only: View all patients with search
router.get("/", protect, authorize("admin"), getAllPatients);

// Admin or Doctor: View patient details
router.get("/:id", protect, authorize("admin", "doctor", "patient"), getPatientById);

// Patient or Admin: Update patient demographics
router.put("/:id", protect, authorize("admin", "patient"), updatePatientProfile);

// Admin only: Block or unblock a patient account
router.patch("/:id/status", protect, authorize("admin"), togglePatientStatus);

module.exports = router;
