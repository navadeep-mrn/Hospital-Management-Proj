// ADMIN DASHBOARD (AdminDashboard.jsx)
// Main administrative control center.
// Displays live analytical metrics fetched directly from MongoDB:
// 1. Total doctors
// 2. Total registered patients
// 3. Total hospital appointments
// 4. Appointments scheduled for today
// 5. Recent appointment activity log and quick administrative shortcuts

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get("/dashboard/admin");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load admin stats:", err);
                setError("Unable to load real-time hospital analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
                        <h2 className="fw-bold mb-1">Hospital Administration Dashboard</h2>
                        <p className="text-muted mb-0">Overview of clinical operations and activity metrics</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Link to="/admin/doctors/add" className="btn btn-primary btn-sm">
                            Add Doctor
                        </Link>
                        <Link to="/admin/appointments" className="btn btn-outline-secondary btn-sm">
                            View Schedule
                        </Link>
                    </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading metrics...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* -------------------------------------------------- */}
                        {/* FOUR CORE ANALYTICS STAT CARDS */}
                        {/* -------------------------------------------------- */}
                        <div className="row g-3 mb-4">
                            <div className="col-sm-6 col-xl-3">
                                <StatCard
                                    title="Total Doctors"
                                    value={stats?.totalDoctors}
                                    variant="blue"
                                />
                            </div>
                            <div className="col-sm-6 col-xl-3">
                                <StatCard
                                    title="Total Patients"
                                    value={stats?.totalPatients}
                                    variant="dark"
                                />
                            </div>
                            <div className="col-sm-6 col-xl-3">
                                <StatCard
                                    title="Total Appointments"
                                    value={stats?.totalAppointments}
                                    variant="blue"
                                />
                            </div>
                            <div className="col-sm-6 col-xl-3">
                                <StatCard
                                    title="Today's Appointments"
                                    value={stats?.todayAppointments}
                                    variant="dark"
                                />
                            </div>
                        </div>

                        {/* Status Breakdown Bar */}
                        <div className="card hms-card border-0 mb-4 p-3">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <span className="fw-semibold text-muted small text-uppercase">
                                    Appointment Status Distribution:
                                </span>
                                <div className="d-flex gap-3">
                                    <span className="badge badge-booked px-3 py-2">
                                        Booked: {stats?.statusCounts?.booked || 0}
                                    </span>
                                    <span className="badge badge-completed px-3 py-2">
                                        Completed: {stats?.statusCounts?.completed || 0}
                                    </span>
                                    <span className="badge badge-cancelled px-3 py-2">
                                        Cancelled: {stats?.statusCounts?.cancelled || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* -------------------------------------------------- */}
                        {/* RECENT APPOINTMENTS TABLE */}
                        {/* -------------------------------------------------- */}
                        <div className="card hms-card border-0 mb-4">
                            <div className="hms-card-header d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Recent Appointments</span>
                                <Link to="/admin/appointments" className="small text-decoration-none">
                                    View All &rarr;
                                </Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Patient</th>
                                            <th>Doctor & Department</th>
                                            <th>Date & Time</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
                                            stats.recentAppointments.map((appt) => (
                                                <tr key={appt._id}>
                                                    <td className="fw-semibold">
                                                        {appt.patient?.user?.name || "Patient"}
                                                        <br />
                                                        <small className="text-muted fw-normal">
                                                            {appt.patient?.user?.email}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {appt.doctor?.user?.name || "Doctor"}
                                                        <br />
                                                        <small className="text-muted">
                                                            {appt.doctor?.specialization?.name}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {appt.date}
                                                        <br />
                                                        <small className="text-muted">{appt.time}</small>
                                                    </td>
                                                    <td className="small text-truncate" style={{ maxWidth: "200px" }}>
                                                        {appt.reason}
                                                    </td>
                                                    <td>{getStatusBadge(appt.status)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-muted">
                                                    No recent appointments found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* -------------------------------------------------- */}
                        {/* QUICK ACTION SHORTCUTS */}
                        {/* -------------------------------------------------- */}
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="p-3 bg-white rounded-3 border hms-card text-center">
                                    <h6 className="fw-bold">Doctor Management</h6>
                                    <p className="text-muted small">Add, edit, deactivate, or assign schedules to doctors</p>
                                    <Link to="/admin/doctors" className="btn btn-outline-primary btn-sm w-100">
                                        Manage Doctors
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-white rounded-3 border hms-card text-center">
                                    <h6 className="fw-bold">Patient Records</h6>
                                    <p className="text-muted small">Search patient accounts, review demographics, or block access</p>
                                    <Link to="/admin/patients" className="btn btn-outline-primary btn-sm w-100">
                                        Manage Patients
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-white rounded-3 border hms-card text-center">
                                    <h6 className="fw-bold">Clinical Departments</h6>
                                    <p className="text-muted small">Add new hospital medical specializations and departments</p>
                                    <Link to="/admin/specializations" className="btn btn-outline-primary btn-sm w-100">
                                        Manage Departments
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
