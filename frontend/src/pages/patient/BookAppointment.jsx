// BOOK APPOINTMENT PAGE (BookAppointment.jsx)
// Patient appointment scheduling interface.
//
// Critical Viva Concepts Implemented Here:
// 1. Patient selects a doctor, date, and consultation time slot.
// 2. Form automatically inspects the doctor's weekly availability schedule for the chosen day.
// 3. Submits to Express backend -> backend verifies MongoDB to prevent double-booking.
// 4. If a conflict occurs, displays: "Doctor is already booked for this time slot".

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";

const standardDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const defaultSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM"
];

const BookAppointment = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedDoctor = searchParams.get("doctor") || "";

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctor);
    const [selectedDoctorObj, setSelectedDoctorObj] = useState(null);

    // Get today's date formatted as YYYY-MM-DD for min date
    const todayStr = new Date().toISOString().split("T")[0];
    const [appointmentDate, setAppointmentDate] = useState(todayStr);
    const [availableSlots, setAvailableSlots] = useState(defaultSlots);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(defaultSlots[0]);
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    // 1. Fetch active doctors for selection dropdown
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await api.get("/doctors?availableOnly=true");
                setDoctors(res.data);
                if (!selectedDoctorId && res.data.length > 0) {
                    setSelectedDoctorId(res.data[0]._id);
                    setSelectedDoctorObj(res.data[0]);
                } else if (selectedDoctorId) {
                    const found = res.data.find((d) => d._id === selectedDoctorId);
                    if (found) setSelectedDoctorObj(found);
                }
            } catch (err) {
                console.error("Error loading doctors:", err);
            }
        };

        fetchDoctors();
    }, [selectedDoctorId]);

    // 2. Adjust available time slots dynamically when Doctor or Date changes
    useEffect(() => {
        if (selectedDoctorObj && appointmentDate) {
            const dateObj = new Date(appointmentDate + "T00:00:00");
            const dayName = standardDays[dateObj.getDay()];

            // Check if doctor defined specific slots for this day
            const daySched = selectedDoctorObj.availability?.find((s) => s.day === dayName);

            if (daySched) {
                if (!daySched.isAvailable) {
                    setFeedback({
                        type: "warning",
                        message: `Note: Dr. ${selectedDoctorObj.user?.name} is usually off on ${dayName}s. You can choose another date or select a slot.`
                    });
                    setAvailableSlots(defaultSlots);
                } else if (daySched.slots && daySched.slots.length > 0) {
                    setAvailableSlots(daySched.slots);
                    setSelectedTimeSlot(daySched.slots[0]);
                    setFeedback({ type: "", message: "" });
                } else {
                    setAvailableSlots(defaultSlots);
                }
            } else {
                setAvailableSlots(defaultSlots);
            }
        }
    }, [selectedDoctorObj, appointmentDate]);

    // Handle Doctor selection change
    const handleDoctorChange = (docId) => {
        setSelectedDoctorId(docId);
        const found = doctors.find((d) => d._id === docId);
        setSelectedDoctorObj(found || null);
    };

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ type: "", message: "" });

        if (!selectedDoctorId || !appointmentDate || !selectedTimeSlot || !reason.trim()) {
            setFeedback({ type: "danger", message: "Please fill in all required fields" });
            return;
        }

        try {
            setLoading(true);

            // ==================================================================
            // SEND BOOKING REQUEST TO EXPRESS
            // The backend performs double-booking validation on (doctor + date + time).
            // ==================================================================
            const res = await api.post("/appointments", {
                doctorId: selectedDoctorId,
                date: appointmentDate,
                time: selectedTimeSlot,
                reason
            });

            setLoading(false);
            setFeedback({ type: "success", message: res.data.message });

            // Redirect to appointments list after brief confirmation
            setTimeout(() => {
                navigate("/patient/appointments");
            }, 1200);
        } catch (err) {
            setLoading(false);
            // If conflict occurred, backend returned 400 with helpful explanation
            setFeedback({
                type: "danger",
                message: err.response?.data?.message || "Failed to book appointment. Please try again."
            });
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Book Doctor Consultation</h2>
                        <p className="text-muted mb-0">Schedule an appointment with conflict-free slot confirmation</p>
                    </div>
                    <Link to="/patient/appointments" className="btn btn-outline-secondary btn-sm">
                        &larr; View My Appointments
                    </Link>
                </div>

                <AlertMessage
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback({ type: "", message: "" })}
                />

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card hms-card border-0 shadow-sm p-4">
                            <form onSubmit={handleSubmit}>
                                {/* 1. Select Doctor */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Select Physician / Specialist *</label>
                                    <select
                                        className="form-select form-select-lg"
                                        value={selectedDoctorId}
                                        onChange={(e) => handleDoctorChange(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose a Doctor --</option>
                                        {doctors.map((doc) => (
                                            <option key={doc._id} value={doc._id}>
                                                {doc.user?.name} — {doc.specialization?.name} ({doc.qualification})
                                            </option>
                                        ))}
                                    </select>
                                    {selectedDoctorObj && (
                                        <div className="mt-2 small text-muted">
                                            Clinical Experience: <strong>{selectedDoctorObj.experience} years</strong> |{" "}
                                            Clinic: <strong>{selectedDoctorObj.user?.address || "Main Medical Wing"}</strong>
                                        </div>
                                    )}
                                </div>

                                <div className="row g-3 mb-4">
                                    {/* 2. Choose Date */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Appointment Date *</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-lg"
                                            min={todayStr}
                                            value={appointmentDate}
                                            onChange={(e) => setAppointmentDate(e.target.value)}
                                            required
                                        />
                                        <small className="text-muted">
                                            Day: {new Date(appointmentDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })}
                                        </small>
                                    </div>

                                    {/* 3. Choose Time Slot */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Available Consultation Slot *</label>
                                        <select
                                            className="form-select form-select-lg"
                                            value={selectedTimeSlot}
                                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                            required
                                        >
                                            {availableSlots.map((slot, index) => (
                                                <option key={index} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="text-muted">Subject to real-time conflict verification</small>
                                    </div>
                                </div>

                                {/* 4. Reason for Visit */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Reason for Consultation / Current Symptoms *
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Describe your symptoms, duration, or the reason for booking this consultation..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="d-flex justify-content-end gap-2">
                                    <Link to="/patient/dashboard" className="btn btn-secondary px-3">
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg px-5 fw-bold shadow-sm"
                                        disabled={loading}
                                    >
                                        {loading ? "Checking Availability..." : "Confirm & Book Slot"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookAppointment;
