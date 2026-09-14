// ==============================================================================
// SPECIALIZATION CONTROLLER
// ==============================================================================
// Handles retrieval and administration of hospital departments/specialties
// (e.g. Cardiology, Neurology, Pediatrics, Orthopedics).

const Specialization = require("../models/Specialization");

// ------------------------------------------------------------------------------
// @desc    Get all medical specializations
// @route   GET /api/specializations
// @access  Public
// ------------------------------------------------------------------------------
const getAllSpecializations = async (req, res) => {
    try {
        const specializations = await Specialization.find().sort({ name: 1 });
        res.json(specializations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching specializations: " + error.message });
    }
};

// ------------------------------------------------------------------------------
// @desc    Create a new specialization (Admin only)
// @route   POST /api/specializations
// @access  Private/Admin
// ------------------------------------------------------------------------------
const createSpecialization = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Specialization name is required" });
        }

        const existing = await Specialization.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ message: "Specialization already exists" });
        }

        const specialization = await Specialization.create({
            name: name.trim(),
            description: description || ""
        });

        res.status(201).json({
            message: "Specialization added successfully",
            specialization
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating specialization: " + error.message });
    }
};

// ------------------------------------------------------------------------------
// @desc    Update specialization (Admin only)
// @route   PUT /api/specializations/:id
// @access  Private/Admin
// ------------------------------------------------------------------------------
const updateSpecialization = async (req, res) => {
    try {
        const { name, description } = req.body;
        const specialization = await Specialization.findById(req.params.id);

        if (!specialization) {
            return res.status(404).json({ message: "Specialization not found" });
        }

        if (name) specialization.name = name.trim();
        if (description !== undefined) specialization.description = description;

        await specialization.save();

        res.json({
            message: "Specialization updated successfully",
            specialization
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating specialization: " + error.message });
    }
};

// ------------------------------------------------------------------------------
// @desc    Delete specialization (Admin only)
// @route   DELETE /api/specializations/:id
// @access  Private/Admin
// ------------------------------------------------------------------------------
const deleteSpecialization = async (req, res) => {
    try {
        const specialization = await Specialization.findByIdAndDelete(req.params.id);
        if (!specialization) {
            return res.status(404).json({ message: "Specialization not found" });
        }
        res.json({ message: "Specialization deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting specialization: " + error.message });
    }
};

module.exports = {
    getAllSpecializations,
    createSpecialization,
    updateSpecialization,
    deleteSpecialization
};
