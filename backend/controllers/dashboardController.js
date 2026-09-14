// DASHBOARD CONTROLLER
// Computes real-time analytical statistics directly from MongoDB.
// Provides role-specific metrics for Admin, Doctor, and Patient dashboards:
// - Admin: Total doctors, total patients, total appointments, today's appointments
// - Doctor: Today's scheduled visits, upcoming visits, completed treatments, patient count
// - Patient: Upcoming visits, completed treatments count, available specialties

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Treatment = require("../models/Treatment");
const Specialization = require("../models/Specialization");

// Helper: Get today's date formatted as "YYYY-MM-DD"
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// @desc    Get Admin Dashboard statistics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const todayStr = getTodayDateString();

        // 1. Total active doctors
        const totalDoctors = await Doctor.countDocuments();

        // 2. Total registered patients
        const totalPatients = await Patient.countDocuments();

        // 3. Total appointments across all statuses
        const totalAppointments = await Appointment.countDocuments();

        // 4. Appointments scheduled for today
        const todayAppointments = await Appointment.countDocuments({
            date: todayStr,
            status: "Booked"
        });

        // 5. Status breakdown
        const bookedAppointments = await Appointment.countDocuments({ status: "Booked" });
        const completedAppointments = await Appointment.countDocuments({ status: "Completed" });
        const cancelledAppointments = await Appointment.countDocuments({ status: "Cancelled" });

        // 6. Recent appointments (latest 5)
        const recentAppointments = await Appointment.find()
            .populate({
                path: "patient",
                populate: { path: "user", select: "name email phone" }
            })
            .populate({
                path: "doctor",
                populate: [
                    { path: "user", select: "name email" },
                    { path: "specialization", select: "name" }
                ]
            })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalDoctors,
            totalPatients,
            totalAppointments,
            todayAppointments,
            statusCounts: {
                booked: bookedAppointments,
                completed: completedAppointments,
                cancelled: cancelledAppointments
            },
            recentAppointments
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({ message: "Error calculating admin statistics: " + error.message });
    }
};

// @desc    Get Doctor Dashboard statistics
// @route   GET /api/dashboard/doctor
// @access  Private/Doctor
const getDoctorStats = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found" });
        }

        const todayStr = getTodayDateString();

        // Today's appointments for this doctor
        const todayAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            date: todayStr,
            status: "Booked"
        });

        // Upcoming appointments (future dates)
        const upcomingAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            date: { $gte: todayStr },
            status: "Booked"
        });

        // Completed appointments
        const completedAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            status: "Completed"
        });

        // Cancelled appointments
        const cancelledAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            status: "Cancelled"
        });

        // Unique patients treated by this doctor
        const treatedPatients = await Appointment.distinct("patient", {
            doctor: doctor._id
        });

        // Today's appointment schedule details
        const todaySchedule = await Appointment.find({
            doctor: doctor._id,
            date: todayStr
        })
            .populate({
                path: "patient",
                populate: { path: "user", select: "name email phone" }
            })
            .sort({ time: 1 });

        res.json({
            todayAppointments,
            upcomingAppointments,
            completedAppointments,
            cancelledAppointments,
            totalPatients: treatedPatients.length,
            todaySchedule
        });
    } catch (error) {
        console.error("Doctor stats error:", error);
        res.status(500).json({ message: "Error calculating doctor statistics: " + error.message });
    }
};

// @desc    Get Patient Dashboard statistics
// @route   GET /api/dashboard/patient
// @access  Private/Patient
const getPatientStats = async (req, res) => {
    try {
        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) {
            return res.status(404).json({ message: "Patient profile not found" });
        }

        const todayStr = getTodayDateString();

        // Find upcoming appointment
        const nextAppointment = await Appointment.findOne({
            patient: patient._id,
            date: { $gte: todayStr },
            status: "Booked"
        })
            .populate({
                path: "doctor",
                populate: [
                    { path: "user", select: "name email phone" },
                    { path: "specialization", select: "name" }
                ]
            })
            .sort({ date: 1, time: 1 });

        // Total appointments booked by patient
        const totalAppointments = await Appointment.countDocuments({ patient: patient._id });

        // Completed medical treatments
        const totalTreatments = await Treatment.countDocuments({ patient: patient._id });

        // Total available hospital departments
        const totalSpecializations = await Specialization.countDocuments();

        // Recent treatments
        const recentTreatments = await Treatment.find({ patient: patient._id })
            .populate({
                path: "doctor",
                populate: [
                    { path: "user", select: "name" },
                    { path: "specialization", select: "name" }
                ]
            })
            .sort({ createdAt: -1 })
            .limit(3);

        res.json({
            nextAppointment,
            totalAppointments,
            totalTreatments,
            totalSpecializations,
            recentTreatments
        });
    } catch (error) {
        console.error("Patient stats error:", error);
        res.status(500).json({ message: "Error calculating patient statistics: " + error.message });
    }
};

module.exports = {
    getAdminStats,
    getDoctorStats,
    getPatientStats
};
