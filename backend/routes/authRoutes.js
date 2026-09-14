// ==============================================================================
// AUTHENTICATION ROUTES
// ==============================================================================
// Public endpoints for registration and login, plus a protected endpoint
// to get the current user's profile.

const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Register a new patient
router.post("/register", register);

// Login for Admin, Doctor, or Patient
router.post("/login", login);

// Get currently logged-in user profile (requires valid JWT token)
router.get("/me", protect, getMe);

module.exports = router;
