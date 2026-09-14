// DASHBOARD ROUTES
// Real database analytics endpoints for Admin, Doctor, and Patient dashboards.

const express = require("express");
const router = express.Router();
const {
    getAdminStats,
    getDoctorStats,
    getPatientStats
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Admin: System overview metrics
router.get("/admin", protect, authorize("admin"), getAdminStats);

// Doctor: Doctor-specific metrics (today's appointments, completed, patients treated)
router.get("/doctor", protect, authorize("doctor"), getDoctorStats);

// Patient: Patient-specific metrics (next appointment, treatment count, departments)
router.get("/patient", protect, authorize("patient"), getPatientStats);

module.exports = router;
