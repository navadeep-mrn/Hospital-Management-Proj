// MANAGE APPOINTMENTS PAGE (ManageAppointments.jsx)
// Administrative appointment oversight:
// - View all scheduled, completed, and cancelled appointments across the hospital
// - Filter by status (Booked, Completed, Cancelled)
// - Filter by specific calendar date
// - Administrative cancellation if requested

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
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
            console.error("Error loading appointments:", err);
            setFeedback({ type: "danger", message: "Failed to load hospital appointments" });
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

    // In-memory search filter for patient/doctor names
    const filteredAppointments = appointments.filter((appt) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        const pName = appt.patient?.user?.name?.toLowerCase() || "";
        const dName = appt.doctor?.user?.name?.toLowerCase() || "";
        const specName = appt.doctor?.specialization?.name?.toLowerCase() || "";
        return pName.includes(q) || dName.includes(q) || specName.includes(q);
    });

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Appointment Management</h2>
                        <p className="text-muted mb-0">Monitor consultations, calendar schedules, and clinical statuses</p>
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
                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-muted">Search Patient / Doctor</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name or department..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-semibold text-muted">Status</label>
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="Booked">Booked</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="col-md-3">
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
                                    setSearchTerm("");
                                    setStatusFilter("");
                                    setDateFilter("");
                                }}
                            >
                                Reset Filters
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
                                    <th>Assigned Doctor</th>
                                    <th>Date & Time</th>
                                    <th>Reason for Consultation</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            Loading appointments...
                                        </td>
                                    </tr>
                                ) : filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((appt) => (
                                        <tr key={appt._id}>
                                            <td className="fw-semibold">
                                                {appt.patient?.user?.name || "Patient"}
                                                <br />
                                                <small className="text-muted fw-normal">
                                                    {appt.patient?.user?.phone || appt.patient?.phone}
                                                </small>
                                            </td>
                                            <td>
                                                <span className="fw-semibold">{appt.doctor?.user?.name || "Doctor"}</span>
                                                <br />
                                                <span className="badge bg-primary-subtle text-primary">
                                                    {appt.doctor?.specialization?.name}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-semibold">{appt.date}</span>
                                                <br />
                                                <small className="text-muted">{appt.time}</small>
                                            </td>
                                            <td className="small" style={{ maxWidth: "220px" }}>
                                                {appt.reason}
                                            </td>
                                            <td>{getStatusBadge(appt.status)}</td>
                                            <td className="text-end">
                                                {appt.status === "Booked" && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleCancel(appt._id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No appointments match the selected criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManageAppointments;
