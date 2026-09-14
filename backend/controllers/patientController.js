// PATIENT CONTROLLER
// Manages patient directory search, profile viewing and editing, and administrative
// account blocking/unblocking.

const User = require("../models/User");
const Patient = require("../models/Patient");
const { normalizePhone, isValidIndianPhone } = require("../utils/phone");

// @desc    Get all patients with search functionality (Admin only)
// @route   GET /api/patients
// @access  Private/Admin
const getAllPatients = async (req, res) => {
    try {
        const { search } = req.query;

        // Fetch all patients with their user details
        let patients = await Patient.find().populate("user", "name email phone address isActive createdAt");

        // Filter by name, email, or phone if search query is present
        if (search) {
            const query = search.toLowerCase();
            patients = patients.filter((p) => {
                const nameMatch = p.user && p.user.name.toLowerCase().includes(query);
                const emailMatch = p.user && p.user.email.toLowerCase().includes(query);
                const phoneMatch = (p.phone && p.phone.includes(query)) || (p.user && p.user.phone && p.user.phone.includes(query));
                return nameMatch || emailMatch || phoneMatch;
            });
        }

        res.json(patients);
    } catch (error) {
        console.error("Get patients error:", error);
        res.status(500).json({ message: "Error fetching patients: " + error.message });
    }
};

// @desc    Get single patient details by ID
// @route   GET /api/patients/:id
// @access  Private (Admin or Doctor)
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate("user", "name email phone address isActive");

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient details: " + error.message });
    }
};

// @desc    Update patient profile details
// @route   PUT /api/patients/:id
// @access  Private (Patient owner or Admin)
const updatePatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Check permission: Must be the patient themselves or an Admin
        if (req.user.role === "patient" && patient.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are only authorized to update your own profile" });
        }

        const { name, age, gender, phone, address } = req.body;
        const normalizedPhone = phone === undefined ? undefined : normalizePhone(phone);

        if (normalizedPhone !== undefined && !isValidIndianPhone(normalizedPhone)) {
            return res.status(400).json({ message: "Phone number must use the format +91 1111111111" });
        }

        // Update User info if name or phone changed
        if (name || phone !== undefined || address !== undefined) {
            await User.findByIdAndUpdate(patient.user, {
                ...(name && { name }),
                ...(normalizedPhone !== undefined && { phone: normalizedPhone }),
                ...(address !== undefined && { address })
            });
        }

        // Update Patient demographics
        if (age !== undefined) patient.age = Number(age);
        if (gender) patient.gender = gender;
        if (normalizedPhone !== undefined) patient.phone = normalizedPhone;
        if (address !== undefined) patient.address = address;

        await patient.save();

        const updatedPatient = await Patient.findById(patient._id).populate("user", "name email phone address isActive");

        res.json({
            message: "Profile updated successfully",
            patient: updatedPatient
        });
    } catch (error) {
        console.error("Update patient error:", error);
        res.status(500).json({ message: "Error updating patient profile: " + error.message });
    }
};

// @desc    Toggle patient block/active status (Admin only)
// @route   PATCH /api/patients/:id/status
// @access  Private/Admin
const togglePatientStatus = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate("user");
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Toggle user account active status
        const user = await User.findById(patient.user._id);
        user.isActive = !user.isActive;
        await user.save();

        res.json({
            message: `Patient account ${user.isActive ? "unblocked" : "blocked"} successfully`,
            isActive: user.isActive
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating patient status: " + error.message });
    }
};

module.exports = {
    getAllPatients,
    getPatientById,
    updatePatientProfile,
    togglePatientStatus
};
