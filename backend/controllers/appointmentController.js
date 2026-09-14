// APPOINTMENT CONTROLLER
// Manages appointment booking, slot double-booking prevention, rescheduling,
// cancellation, and status updates across Admin, Doctor, and Patient roles.

const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient or Admin)
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, reason } = req.body;

        if (!doctorId || !date || !time || !reason) {
            return res.status(400).json({ message: "Please provide doctor, date, time slot, and reason for visit" });
        }

        // Determine the patient ID
        let patientId = req.body.patientId;
        if (req.user.role === "patient") {
            const patient = await Patient.findOne({ user: req.user._id });
            if (!patient) {
                return res.status(404).json({ message: "Patient profile not found for this user" });
            }
            patientId = patient._id;
        }

        if (!patientId) {
            return res.status(400).json({ message: "Patient ID is required" });
        }

        // Verify doctor exists and is active
        const doctor = await Doctor.findById(doctorId);
        if (!doctor || !doctor.isAvailable) {
            return res.status(400).json({ message: "Selected doctor is not available for appointments" });
        }

        // DOUBLE BOOKING PREVENTION LOGIC
        // Check whether another active appointment already exists for this doctor
        // at the selected date and time slot.
        // We only check for status: "Booked" because "Cancelled" or "Completed"
        // appointments free up the doctor's time slot for new bookings.
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date,
            time,
            status: "Booked"
        });

        if (existingAppointment) {
            return res.status(400).json({
                message: "Doctor is already booked for this time slot. Please choose another slot or date."
            });
        }

        // Create the new appointment
        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            date,
            time,
            reason,
            status: "Booked"
        });

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate({
                path: "patient",
                populate: { path: "user", select: "name email phone" }
            })
            .populate({
                path: "doctor",
                populate: [
                    { path: "user", select: "name email phone" },
                    { path: "specialization", select: "name" }
                ]
            });

        res.status(201).json({
            message: "Appointment booked successfully!",
            appointment: populatedAppointment
        });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Error booking appointment: " + error.message });
    }
};

// @desc    Get all appointments (Role-filtered)
// @route   GET /api/appointments
// @access  Private (Admin: all, Doctor: own, Patient: own)
const getAppointments = async (req, res) => {
    try {
        let filter = {};

        // Role-based filtering:
        // - Admin sees all appointments
        // - Doctor sees only appointments assigned to them
        // - Patient sees only appointments they booked
        if (req.user.role === "doctor") {
            const doctor = await Doctor.findOne({ user: req.user._id });
            if (!doctor) return res.json([]);
            filter.doctor = doctor._id;
        } else if (req.user.role === "patient") {
            const patient = await Patient.findOne({ user: req.user._id });
            if (!patient) return res.json([]);
            filter.patient = patient._id;
        }

        // Optional query filters
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.date) {
            filter.date = req.query.date;
        }

        const appointments = await Appointment.find(filter)
            .populate({
                path: "patient",
                populate: { path: "user", select: "name email phone" }
            })
            .populate({
                path: "doctor",
                populate: [
                    { path: "user", select: "name email phone" },
                    { path: "specialization", select: "name" }
                ]
            })
            .sort({ date: -1, createdAt: -1 });

        res.json(appointments);
    } catch (error) {
        console.error("Get appointments error:", error);
        res.status(500).json({ message: "Error fetching appointments: " + error.message });
    }
};

// @desc    Get single appointment details by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate({
                path: "patient",
                populate: { path: "user", select: "name email phone address" }
            })
            .populate({
                path: "doctor",
                populate: [
                    { path: "user", select: "name email phone" },
                    { path: "specialization", select: "name" }
                ]
            });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment: " + error.message });
    }
};

// @desc    Reschedule appointment date and time
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Patient or Admin)
const rescheduleAppointment = async (req, res) => {
    try {
        const { date, time } = req.body;
        if (!date || !time) {
            return res.status(400).json({ message: "Please provide new date and time" });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.status !== "Booked") {
            return res.status(400).json({ message: `Cannot reschedule an appointment that is already ${appointment.status}` });
        }

        // Double-booking prevention check for the new date and time slot
        const conflictingSlot = await Appointment.findOne({
            _id: { $ne: appointment._id }, // Exclude current appointment
            doctor: appointment.doctor,
            date,
            time,
            status: "Booked"
        });

        if (conflictingSlot) {
            return res.status(400).json({
                message: "Doctor is already booked for this new time slot. Please select another slot."
            });
        }

        appointment.date = date;
        appointment.time = time;
        await appointment.save();

        res.json({
            message: "Appointment rescheduled successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: "Error rescheduling appointment: " + error.message });
    }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient, Doctor, or Admin)
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.status === "Completed") {
            return res.status(400).json({ message: "Completed appointments cannot be cancelled" });
        }

        appointment.status = "Cancelled";
        await appointment.save();

        res.json({
            message: "Appointment cancelled successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling appointment: " + error.message });
    }
};

// @desc    Mark appointment as Completed (Doctor only)
// @route   PUT /api/appointments/:id/complete
// @access  Private/Doctor
const completeAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        appointment.status = "Completed";
        await appointment.save();

        res.json({
            message: "Appointment marked as completed",
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: "Error completing appointment: " + error.message });
    }
};

module.exports = {
    bookAppointment,
    getAppointments,
    getAppointmentById,
    rescheduleAppointment,
    cancelAppointment,
    completeAppointment
};
