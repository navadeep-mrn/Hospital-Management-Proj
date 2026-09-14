// ==============================================================================
// PATIENT APPOINTMENTS PAGE (PatientAppointments.jsx)
// ==============================================================================
// Displays all consultations booked by the logged-in patient.
// Supports:
// 1. Viewing appointment details and current lifecycle status (Booked, Completed, Cancelled).
// 2. Rescheduling active appointments to a new date and time slot (with double-booking check).
// 3. Cancelling active appointments.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";

const standardSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM"
];

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    // Reschedule Modal State
    const [rescheduleModalAppt, setRescheduleModalAppt] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState(standardSlots[0]);
    const [rescheduling, setRescheduling] = useState(false);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const url = statusFilter ? `/appointments?status=${statusFilter}` : "/appointments";
            const res = await api.get(url);
            setAppointments(res.data);
        } catch (err) {
            console.error("Error loading patient appointments:", err);
            setFeedback({ type: "danger", message: "Failed to load appointments" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, [statusFilter]);

    // Handle Appointment Cancellation
    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const res = await api.put(`/appointments/${id}/cancel`);
            setFeedback({ type: "success", message: res.data.message });
            loadAppointments();
        } catch (err) {
            setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to cancel appointment" });
        }
    };

    // Open Reschedule Modal
    const openRescheduleModal = (appt) => {
        setRescheduleModalAppt(appt);
        setNewDate(appt.date);
        setNewTime(appt.time || standardSlots[0]);
    };

    // Submit Reschedule Request
    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        if (!newDate || !newTime) return;

        try {
            setRescheduling(true);
            const res = await api.put(`/appointments/${rescheduleModalAppt._id}/reschedule`, {
                date: newDate,
                time: newTime
            });
            setRescheduling(false);
            setRescheduleModalAppt(null);
            setFeedback({ type: "success", message: res.data.message });
            loadAppointments();
        } catch (err) {
            setRescheduling(false);
            setFeedback({
                type: "danger",
                message: err.response?.data?.message || "Failed to reschedule appointment"
            });
        }
    };

    const getStatusBadge = (status) => {
        if (status === "Booked") return <span className="badge badge-booked">Booked</span>;
        if (status === "Completed") return <span className="badge badge-completed">Completed</span>;
        if (status === "Cancelled") return <span className="badge badge-cancelled">Cancelled</span>;
        return <span className="badge bg-secondary">{status}</span>;
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">My Appointments</h2>
                        <p className="text-muted mb-0">Track your scheduled, completed, and cancelled consultations</p>
                    </div>
                    <Link to="/patient/appointments/book" className="btn btn-primary">
                        ➕ Book New Appointment
                    </Link>
                </div>

                <AlertMessage
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback({ type: "", message: "" })}
                />

                {/* Filter Controls */}
                <div className="card hms-card border-0 mb-4 p-3 shadow-sm">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold small text-muted">Filter by Status:</span>
                            <button
                                className={`btn btn-sm ${statusFilter === "" ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setStatusFilter("")}
                            >
                                All
                            </button>
                            <button
                                className={`btn btn-sm ${statusFilter === "Booked" ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setStatusFilter("Booked")}
                            >
                                Booked
                            </button>
                            <button
                                className={`btn btn-sm ${statusFilter === "Completed" ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setStatusFilter("Completed")}
                            >
                                Completed
                            </button>
                            <button
                                className={`btn btn-sm ${statusFilter === "Cancelled" ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setStatusFilter("Cancelled")}
                            >
                                Cancelled
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appointments Table */}
                <div className="card hms-card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Doctor & Department</th>
                                    <th>Date & Time</th>
                                    <th>Reason for Visit</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            Loading your appointments...
                                        </td>
                                    </tr>
                                ) : appointments.length > 0 ? (
                                    appointments.map((appt) => (
                                        <tr key={appt._id}>
                                            <td className="fw-semibold">
                                                {appt.doctor?.user?.name || "Doctor"}
                                                <br />
                                                <span className="badge bg-primary-subtle text-primary">
                                                    {appt.doctor?.specialization?.name}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-bold">{appt.date}</span>
                                                <br />
                                                <small className="text-muted">{appt.time}</small>
                                            </td>
                                            <td className="small" style={{ maxWidth: "250px" }}>
                                                {appt.reason}
                                            </td>
                                            <td>{getStatusBadge(appt.status)}</td>
                                            <td className="text-end">
                                                {appt.status === "Booked" && (
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-primary"
                                                            onClick={() => openRescheduleModal(appt)}
                                                        >
                                                            Reschedule
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleCancel(appt._id)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                                {appt.status === "Completed" && (
                                                    <Link to="/patient/history" className="btn btn-outline-success btn-sm">
                                                        View Prescription
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No appointments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reschedule Modal */}
                {rescheduleModalAppt && (
                    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title fw-bold">Reschedule Appointment</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setRescheduleModalAppt(null)}
                                    ></button>
                                </div>
                                <form onSubmit={handleRescheduleSubmit}>
                                    <div className="modal-body p-4">
                                        <div className="mb-3">
                                            <strong>Doctor:</strong> Dr. {rescheduleModalAppt.doctor?.user?.name} (
                                            {rescheduleModalAppt.doctor?.specialization?.name})
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">New Consultation Date *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                min={new Date().toISOString().split("T")[0]}
                                                value={newDate}
                                                onChange={(e) => setNewDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">New Time Slot *</label>
                                            <select
                                                className="form-select"
                                                value={newTime}
                                                onChange={(e) => setNewTime(e.target.value)}
                                                required
                                            >
                                                {standardSlots.map((slot, idx) => (
                                                    <option key={idx} value={slot}>
                                                        {slot}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-light">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setRescheduleModalAppt(null)}
                                            disabled={rescheduling}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary px-4" disabled={rescheduling}>
                                            {rescheduling ? "Verifying & Rescheduling..." : "Confirm Reschedule"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PatientAppointments;
