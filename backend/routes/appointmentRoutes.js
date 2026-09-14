// ==============================================================================
// APPOINTMENT ROUTES
// ==============================================================================
// Endpoints for booking, listing, rescheduling, cancelling, and completing appointments.

const express = require("express");
const router = express.Router();
const {
    bookAppointment,
    getAppointments,
    getAppointmentById,
    rescheduleAppointment,
    cancelAppointment,
    completeAppointment
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Patient or Admin: Book a new appointment (validates double-booking)
router.post("/", protect, authorize("patient", "admin"), bookAppointment);

// Authenticated: Get appointments (role-filtered by Admin, Doctor, or Patient)
router.get("/", protect, getAppointments);

// Authenticated: Get single appointment details
router.get("/:id", protect, getAppointmentById);

// Patient or Admin: Reschedule appointment date and time
router.put("/:id/reschedule", protect, authorize("patient", "admin"), rescheduleAppointment);

// Patient, Doctor, or Admin: Cancel an appointment
router.put("/:id/cancel", protect, cancelAppointment);

// Doctor only: Mark appointment as Completed
router.put("/:id/complete", protect, authorize("doctor"), completeAppointment);

module.exports = router;
