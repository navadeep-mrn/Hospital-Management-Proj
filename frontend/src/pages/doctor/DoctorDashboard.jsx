// ==============================================================================
// DOCTOR DASHBOARD (DoctorDashboard.jsx)
// ==============================================================================
// Doctor portal home view:
// 1. Shows today's scheduled consultations, upcoming visits, completed consultations,
//    and total unique patients treated (calculated directly from MongoDB).
// 2. Today's patient schedule table with instant action to complete consultation
//    and record diagnosis & prescription.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import TreatmentModal from "../../components/TreatmentModal";
import AlertMessage from "../../components/AlertMessage";

const DoctorDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeAppointment, setActiveAppointment] = useState(null);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const loadDoctorStats = async () => {
        try {
            setLoading(true);
            const res = await api.get("/dashboard/doctor");
            setStats(res.data);
        } catch (err) {
            console.error("Error loading doctor stats:", err);
            setFeedback({ type: "danger", message: "Failed to load doctor dashboard data" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDoctorStats();
    }, []);

    const handleCancel = async (apptId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const res = await api.put(`/appointments/${apptId}/cancel`);
            setFeedback({ type: "success", message: res.data.message });
            loadDoctorStats();
        } catch (err) {
            setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to cancel appointment" });
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Doctor Consultation Portal</h2>
                        <p className="text-muted mb-0">Daily schedule overview and patient appointments</p>
                    </div>
                    <Link to="/doctor/availability" className="btn btn-outline-primary btn-sm">
                        Update Availability Schedule
                    </Link>
                </div>

                <AlertMessage
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback({ type: "", message: "" })}
                />

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading doctor metrics...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Metrics Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-sm-6 col-xl-3">
                                <StatCard
                                    title="Today's Visits"
                                    value={stats?.todayAppointments}
                                    variant="blue"
                                />
                            </div>
                            <div className="col-sm-6 col-xl-3">
                                <StatCard
                                    title="Upcoming Visits"
                                    value={stats?.upcomingAppointments}
                                    variant="blue"
                                />
                            </div>
                            <div className="col-sm-6 col-xl-3">
                                <StatCard
                                    title="Completed Visits"
                                    value={stats?.completedAppointments}
                                    variant="dark"
                                />
                            </div>
                            <div className="col-sm-6 col-xl-3">
                                <StatCard
                                    title="Total Patients"
                                    value={stats?.totalPatients}
                                    variant="dark"
                                />
                            </div>
                        </div>

                        {/* Today's Schedule Table */}
                        <div className="card hms-card border-0 mb-4 shadow-sm">
                            <div className="hms-card-header d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Today's Patient Schedule</span>
                                <Link to="/doctor/appointments" className="small text-decoration-none">
                                    All Appointments &rarr;
                                </Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Time Slot</th>
                                            <th>Patient Name</th>
                                            <th>Contact</th>
                                            <th>Reason for Consultation</th>
                                            <th>Status</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats?.todaySchedule && stats.todaySchedule.length > 0 ? (
                                            stats.todaySchedule.map((appt) => (
                                                <tr key={appt._id}>
                                                    <td className="fw-bold text-primary">{appt.time}</td>
                                                    <td className="fw-semibold">
                                                        {appt.patient?.user?.name || "Patient"}
                                                    </td>
                                                    <td>
                                                        <small>{appt.patient?.user?.phone || "N/A"}</small>
                                                    </td>
                                                    <td className="small" style={{ maxWidth: "250px" }}>
                                                        {appt.reason}
                                                    </td>
                                                    <td>
                                                        {appt.status === "Booked" && (
                                                            <span className="badge badge-booked">Booked</span>
                                                        )}
                                                        {appt.status === "Completed" && (
                                                            <span className="badge badge-completed">Completed</span>
                                                        )}
                                                        {appt.status === "Cancelled" && (
                                                            <span className="badge badge-cancelled">Cancelled</span>
                                                        )}
                                                    </td>
                                                    <td className="text-end">
                                                        {appt.status === "Booked" && (
                                                            <div className="btn-group btn-group-sm">
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => setActiveAppointment(appt)}
                                                                >
                                                                    Complete & Prescribe
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
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    No consultations scheduled for today.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Treatment Diagnosis Modal */}
                {activeAppointment && (
                    <TreatmentModal
                        appointment={activeAppointment}
                        onClose={() => setActiveAppointment(null)}
                        onSuccess={() => {
                            setActiveAppointment(null);
                            setFeedback({ type: "success", message: "Treatment record recorded and appointment marked as completed!" });
                            loadDoctorStats();
                        }}
                    />
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;
