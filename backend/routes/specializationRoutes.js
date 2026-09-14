// ==============================================================================
// SPECIALIZATION ROUTES
// ==============================================================================
// Endpoints for browsing hospital departments and administrative department management.

const express = require("express");
const router = express.Router();
const {
    getAllSpecializations,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization
} = require("../controllers/specializationController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Public: View all specializations / departments
router.get("/", getAllSpecializations);

// Admin only: Add a new specialization
router.post("/", protect, authorize("admin"), createSpecialization);

// Admin only: Update specialization details
router.put("/:id", protect, authorize("admin"), updateSpecialization);

// Admin only: Delete a specialization
router.delete("/:id", protect, authorize("admin"), deleteSpecialization);

module.exports = router;
