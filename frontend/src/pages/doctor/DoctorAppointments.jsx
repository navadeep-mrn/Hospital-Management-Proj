// ==============================================================================
// DOCTOR APPOINTMENTS PAGE (DoctorAppointments.jsx)
// ==============================================================================
// Complete calendar view of appointments assigned to the logged-in doctor.
// Supports status filtering (Booked, Completed, Cancelled), date filtering,
// and opening the TreatmentModal to complete an appointment and issue prescriptions.

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import TreatmentModal from "../../components/TreatmentModal";
import AlertMessage from "../../components/AlertMessage";

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeAppointment, setActiveAppointment] = useState(null);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const loadAppointments = async () => {
        try {
            setLoading(true);
            let url = "/appointments?";
            if (statusFilter) url += `status=${statusFilter}&`;
            if (dateFilter) url += `date=${dateFilter}&`;

            const res = await api.get(url);
            setAppointments(res.data);
        } catch (err) {
            console.error("Error loading doctor appointments:", err);
            setFeedback({ type: "danger", message: "Failed to load assigned appointments" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, [statusFilter, dateFilter]);

    const handleCancel = async (apptId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const res = await api.put(`/appointments/${apptId}/cancel`);
            setFeedback({ type: "success", message: res.data.message });
            loadAppointments();
        } catch (err) {
            setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to cancel appointment" });
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
                        <h2 className="fw-bold mb-1">My Patient Appointments</h2>
                        <p className="text-muted mb-0">Consultations assigned to you across all hospital dates</p>
                    </div>
                </div>

                <AlertMessage
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback({ type: "", message: "" })}
                />

                {/* Filter Controls */}
                <div className="card hms-card border-0 mb-4 p-3">
                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label small fw-semibold text-muted">Status</label>
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="Booked">Booked (Pending)</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label small fw-semibold text-muted">Filter by Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setStatusFilter("");
                                    setDateFilter("");
                                }}
                            >
                                Reset
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
                                    <th>Patient</th>
                                    <th>Date & Time</th>
                                    <th>Reason / Symptoms</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            Loading consultations...
                                        </td>
                                    </tr>
                                ) : appointments.length > 0 ? (
                                    appointments.map((appt) => (
                                        <tr key={appt._id}>
                                            <td className="fw-semibold">
                                                {appt.patient?.user?.name || "Patient"}
                                                <br />
                                                <small className="text-muted fw-normal">
                                                    Phone: {appt.patient?.user?.phone || appt.patient?.phone || "N/A"}
                                                </small>
                                            </td>
                                            <td>
                                                <span className="fw-semibold">{appt.date}</span>
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
                                                            className="btn btn-primary"
                                                            onClick={() => setActiveAppointment(appt)}
                                                        >
                                                            Complete Consultation
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleCancel(appt._id)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
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

                {/* Treatment Modal */}
                {activeAppointment && (
                    <TreatmentModal
                        appointment={activeAppointment}
                        onClose={() => setActiveAppointment(null)}
                        onSuccess={() => {
                            setActiveAppointment(null);
                            setFeedback({ type: "success", message: "Treatment record saved and marked completed!" });
                            loadAppointments();
                        }}
                    />
                )}
            </main>
        </div>
    );
};

export default DoctorAppointments;
