// DOCTOR CONTROLLER
// Handles doctor management, searching, profile retrieval, availability scheduling,
// and administrative CRUD operations for doctors.

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const { normalizePhone, isValidIndianPhone } = require("../utils/phone");
const Specialization = require("../models/Specialization");
const Appointment = require("../models/Appointment");

// Default 7-day schedule template for new doctors
const defaultAvailability = [
    { day: "Monday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Tuesday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Wednesday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Thursday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Friday", isAvailable: true, slots: ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] },
    { day: "Saturday", isAvailable: true, slots: ["10:00 AM - 01:00 PM"] },
    { day: "Sunday", isAvailable: false, slots: [] }
];

// @desc    Get all doctors with optional search and specialization filters
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res) => {
    try {
        const { search, specialization, availableOnly } = req.query;

        // Build filter criteria
        let filter = {};

        if (specialization) {
            filter.specialization = specialization;
        }

        if (availableOnly === "true") {
            filter.isAvailable = true;
        }

        // Fetch doctors and populate linked user credentials and specialization name
        let doctors = await Doctor.find(filter)
            .populate("user", "name email phone address isActive")
            .populate("specialization", "name description");

        // If search term is provided, filter by doctor name or specialization name in memory
        if (search) {
            const query = search.toLowerCase();
            doctors = doctors.filter((doc) => {
                const nameMatch = doc.user && doc.user.name.toLowerCase().includes(query);
                const specMatch = doc.specialization && doc.specialization.name.toLowerCase().includes(query);
                return nameMatch || specMatch;
            });
        }

        res.json(doctors);
    } catch (error) {
        console.error("Get doctors error:", error);
        res.status(500).json({ message: "Error fetching doctors: " + error.message });
    }
};

// @desc    Get single doctor details by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate("user", "name email phone address isActive")
            .populate("specialization", "name description");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctor details: " + error.message });
    }
};

// @desc    Create a new doctor (Admin only)
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
    try {
        const { name, email, password, phone, address, specialization, qualification, experience, availability } = req.body;

        if (!name || !email || !password || !specialization || !qualification || experience === undefined) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const normalizedPhone = normalizePhone(phone);
        if (!isValidIndianPhone(normalizedPhone)) {
            return res.status(400).json({ message: "Phone number must use the format +91 1111111111" });
        }

        // Verify email uniqueness
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        // Hash default password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user account with doctor role
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "doctor",
            phone: normalizedPhone,
            address: address || "",
            isActive: true
        });

        // Create linked Doctor record
        const doctor = await Doctor.create({
            user: user._id,
            specialization,
            qualification,
            experience: Number(experience),
            availability: availability && availability.length > 0 ? availability : defaultAvailability,
            isAvailable: true
        });

        const populatedDoctor = await Doctor.findById(doctor._id)
            .populate("user", "name email phone address isActive")
            .populate("specialization", "name description");

        res.status(201).json({
            message: "Doctor added successfully",
            doctor: populatedDoctor
        });
    } catch (error) {
        console.error("Create doctor error:", error);
        res.status(500).json({ message: "Error creating doctor: " + error.message });
    }
};

// @desc    Update doctor profile (Admin or Doctor)
// @route   PUT /api/doctors/:id
// @access  Private (Admin or Doctor owner)
const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Check if user is Admin OR the Doctor updating their own profile
        if (req.user.role === "doctor" && doctor.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only update your own profile" });
        }

        const { name, phone, address, qualification, experience, specialization, availability, isAvailable } = req.body;
        const normalizedPhone = phone === undefined ? undefined : normalizePhone(phone);

        if (normalizedPhone !== undefined && !isValidIndianPhone(normalizedPhone)) {
            return res.status(400).json({ message: "Phone number must use the format +91 1111111111" });
        }

        // Update User info if provided
        if (name || phone !== undefined || address !== undefined) {
            await User.findByIdAndUpdate(doctor.user, {
                ...(name && { name }),
                ...(normalizedPhone !== undefined && { phone: normalizedPhone }),
                ...(address !== undefined && { address })
            });
        }

        // Update Doctor info
        if (qualification) doctor.qualification = qualification;
        if (experience !== undefined) doctor.experience = Number(experience);
        if (specialization) doctor.specialization = specialization;
        if (availability) doctor.availability = availability;
        if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

        await doctor.save();

        const updatedDoctor = await Doctor.findById(doctor._id)
            .populate("user", "name email phone address isActive")
            .populate("specialization", "name description");

        res.json({
            message: "Doctor profile updated successfully",
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error("Update doctor error:", error);
        res.status(500).json({ message: "Error updating doctor: " + error.message });
    }
};

// @desc    Toggle doctor active status or availability (Admin only)
// @route   PATCH /api/doctors/:id/status
// @access  Private/Admin
const toggleDoctorStatus = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate("user");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Toggle user account active status
        const user = await User.findById(doctor.user._id);
        user.isActive = !user.isActive;
        await user.save();

        // Also reflect availability
        doctor.isAvailable = user.isActive;
        await doctor.save();

        res.json({
            message: `Doctor ${user.isActive ? "activated" : "deactivated"} successfully`,
            isActive: user.isActive,
            isAvailable: doctor.isAvailable
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating doctor status: " + error.message });
    }
};
// @desc    Update doctor's 7-day availability schedule
// @route   PUT /api/doctors/:id/availability
// @access  Private (Doctor owner or Admin)
const updateDoctorAvailability = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Only the doctor themselves or Admin can update this
        if (req.user.role === "doctor" && doctor.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only update your own availability schedule" });
        }

        const { availability } = req.body;
        if (!availability || !Array.isArray(availability)) {
            return res.status(400).json({ message: "Please provide a valid availability schedule array" });
        }

        doctor.availability = availability;
        await doctor.save();

        res.json({
            message: "Availability schedule updated successfully",
            availability: doctor.availability
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating availability: " + error.message });
    }
};

// ------------------------------------------------------------------------------
// @desc    Delete doctor and linked user account (Admin only)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
// ------------------------------------------------------------------------------
const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Delete associated user record
        await User.findByIdAndDelete(doctor.user);
        // Delete doctor profile
        await Doctor.findByIdAndDelete(req.params.id);

        res.json({ message: "Doctor and account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting doctor: " + error.message });
    }
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    toggleDoctorStatus,
    updateDoctorAvailability,
    deleteDoctor
};
