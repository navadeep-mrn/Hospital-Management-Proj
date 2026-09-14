// ==============================================================================
// AUTHENTICATION CONTROLLER
// ==============================================================================
// Manages patient registration, user login for all roles, and fetching the
// currently authenticated user profile.
// Uses bcryptjs for password hashing and jsonwebtoken (JWT) for stateless sessions.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const { normalizePhone, isValidIndianPhone } = require("../utils/phone");

// ------------------------------------------------------------------------------
// Helper: Generate JWT Token
// ------------------------------------------------------------------------------
// Signs a JSON Web Token with the user's ID and role, expiring in 7 days.
// The frontend stores this token and includes it in the HTTP Authorization header.
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

// ------------------------------------------------------------------------------
// @desc    Register a new Patient
// @route   POST /api/auth/register
// @access  Public
// ------------------------------------------------------------------------------
const register = async (req, res) => {
    try {
        const { name, email, password, phone, address, age, gender } = req.body;

        // Basic validation of required fields
        if (!name || !email || !password || !age || !gender) {
            return res.status(400).json({ message: "Please fill in all required fields (name, email, password, age, gender)" });
        }

        const normalizedPhone = normalizePhone(phone);
        if (!isValidIndianPhone(normalizedPhone)) {
            return res.status(400).json({ message: "Phone number must use the format +91 1111111111" });
        }

        // Check if a user with this email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        // Hash the password with bcrypt before storing it in the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the base User record with role "patient"
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "patient",
            phone: normalizedPhone,
            address: address || "",
            isActive: true
        });

        // Create the linked Patient profile with clinical demographics
        const patient = await Patient.create({
            user: user._id,
            age,
            gender,
            phone: normalizedPhone,
            address: address || ""
        });

        // Generate JWT token for immediate login after registration
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            message: "Registration successful! Welcome to our hospital.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                patientId: patient._id
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration: " + error.message });
    }
};

// ------------------------------------------------------------------------------
// @desc    Authenticate User & get token (Login for Admin, Doctor, Patient)
// @route   POST /api/auth/login
// @access  Public
// ------------------------------------------------------------------------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if account has been deactivated
        if (!user.isActive) {
            return res.status(403).json({ message: "Your account has been deactivated. Please contact the hospital administrator." });
        }

        // Compare entered password with hashed password stored in MongoDB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Find associated role profile ID if doctor or patient
        let doctorId = null;
        let patientId = null;

        if (user.role === "doctor") {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) doctorId = doctor._id;
        } else if (user.role === "patient") {
            const patient = await Patient.findOne({ user: user._id });
            if (patient) patientId = patient._id;
        }

        // Generate authentication token
        const token = generateToken(user._id, user.role);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                doctorId,
                patientId
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login: " + error.message });
    }
};

// ------------------------------------------------------------------------------
// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private (Authenticated users)
// ------------------------------------------------------------------------------
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let profileData = null;
        if (user.role === "doctor") {
            profileData = await Doctor.findOne({ user: user._id }).populate("specialization");
        } else if (user.role === "patient") {
            profileData = await Patient.findOne({ user: user._id });
        }

        res.json({
            user,
            profile: profileData
        });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

module.exports = {
    register,
    login,
    getMe
};
