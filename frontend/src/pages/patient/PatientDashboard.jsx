// PATIENT DASHBOARD (PatientDashboard.jsx)
// Patient home view:
// 1. Highlights upcoming appointment details (date, time, doctor, department).
// 2. Metric cards: Total appointments, Completed consultations, Available departments.
// 3. Quick consultation shortcuts and recent clinical prescriptions overview.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";

const PatientDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientDashboard = async () => {
            try {
                const res = await api.get("/dashboard/patient");
                setStats(res.data);
            } catch (err) {
                console.error("Error loading patient stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientDashboard();
    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Patient Portal</h2>
                        <p className="text-muted mb-0">Manage appointments, explore doctors, and access medical records</p>
                    </div>
                    <Link to="/patient/appointments/book" className="btn btn-primary">
                        ➕ Book New Appointment
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading your medical overview...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Next Upcoming Appointment Highlight Banner */}
                        {stats?.nextAppointment ? (
                            <div className="card hms-card border-0 mb-4 text-white p-4 shadow-sm" style={{ background: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e3a8a 100%)" }}>
                                <div className="row align-items-center">
                                    <div className="col-lg-8">
                                        <span className="badge bg-white text-dark px-3 py-1 mb-2 fw-semibold border">
                                            Upcoming Scheduled Visit
                                        </span>
                                        <h4 className="fw-bold mb-2">
                                            Dr. {stats.nextAppointment.doctor?.user?.name}
                                        </h4>
                                        <p className="mb-2 opacity-90">
                                            Department: <strong>{stats.nextAppointment.doctor?.specialization?.name}</strong>
                                        </p>
                                        <div className="d-flex flex-wrap gap-3 small opacity-90">
                                            <span><strong>Date:</strong> {stats.nextAppointment.date}</span>
                                            <span><strong>Time Slot:</strong> {stats.nextAppointment.time}</span>
                                            <span><strong>Reason:</strong> {stats.nextAppointment.reason}</span>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                                        <Link to="/patient/appointments" className="btn btn-light fw-semibold px-4">
                                            Manage Appointment &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="card hms-card border-0 mb-4 p-4 text-center bg-white">
                                <h5 className="fw-bold text-secondary mb-1">No Upcoming Appointments</h5>
                                <p className="text-muted mb-3">You do not have any pending doctor visits scheduled.</p>
                                <div>
                                    <Link to="/patient/appointments/book" className="btn btn-outline-primary btn-sm px-4">
                                        Book a Doctor Visit Today
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Metric Stat Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <StatCard
                                    title="Total Appointments"
                                    value={stats?.totalAppointments}
                                    variant="blue"
                                />
                            </div>
                            <div className="col-md-4">
                                <StatCard
                                    title="Completed Treatments"
                                    value={stats?.totalTreatments}
                                    variant="dark"
                                />
                            </div>
                            <div className="col-md-4">
                                <StatCard
                                    title="Medical Departments"
                                    value={stats?.totalSpecializations}
                                    variant="blue"
                                />
                            </div>
                        </div>

                        {/* Recent Medical Records */}
                        <div className="card hms-card border-0 mb-4 shadow-sm">
                            <div className="hms-card-header d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Recent Clinical Prescriptions & Diagnoses</span>
                                <Link to="/patient/history" className="small text-decoration-none">
                                    Full Medical History &rarr;
                                </Link>
                            </div>
                            <div className="card-body p-3">
                                {stats?.recentTreatments && stats.recentTreatments.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {stats.recentTreatments.map((item) => (
                                            <div key={item._id} className="p-3 bg-light rounded-3 border">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="fw-bold text-primary">
                                                        Diagnosis: {item.diagnosis}
                                                    </span>
                                                    <small className="text-muted">
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </small>
                                                </div>
                                                <div className="small text-muted mb-2">
                                                    Doctor: <strong>{item.doctor?.user?.name}</strong> ({item.doctor?.specialization?.name})
                                                </div>
                                                <div className="small font-monospace bg-white p-2 rounded border">
                                                    {item.prescription}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted text-center py-3 mb-0">
                                        No recent clinical treatment records.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Patient Actions */}
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="card hms-card border-0 p-3 h-100 text-center">
                                    <h5 className="fw-bold">Browse Specialists</h5>
                                    <p className="text-muted small">
                                        Search doctors by cardiology, neurology, pediatrics, and more.
                                    </p>
                                    <Link to="/patient/doctors" className="btn btn-outline-primary btn-sm">
                                        Search Doctors
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card hms-card border-0 p-3 h-100 text-center">
                                    <h5 className="fw-bold">Personal Profile</h5>
                                    <p className="text-muted small">
                                        Keep your phone number, age, and home address up to date.
                                    </p>
                                    <Link to="/patient/profile" className="btn btn-outline-primary btn-sm">
                                        Update Profile
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

export default PatientDashboard;
