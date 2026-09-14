// ==============================================================================
// DOCTOR ROUTES
// ==============================================================================
// Endpoints for browsing doctors (public), managing doctor availability (doctor),
// and full CRUD operations (admin).

const express = require("express");
const router = express.Router();
const {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    toggleDoctorStatus,
    updateDoctorAvailability,
    deleteDoctor
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Public: Browse and search all doctors
router.get("/", getAllDoctors);

// Public: View single doctor profile
router.get("/:id", getDoctorById);

// Admin only: Add a new doctor
router.post("/", protect, authorize("admin"), createDoctor);

// Admin or Doctor: Update profile details
router.put("/:id", protect, authorize("admin", "doctor"), updateDoctor);

// Admin only: Toggle active/availability status
router.patch("/:id/status", protect, authorize("admin"), toggleDoctorStatus);

// Doctor or Admin: Update 7-day availability schedule
router.put("/:id/availability", protect, authorize("admin", "doctor"), updateDoctorAvailability);

// Admin only: Delete a doctor
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

module.exports = router;
