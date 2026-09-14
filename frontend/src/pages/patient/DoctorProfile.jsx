// ==============================================================================
// DOCTOR PROFILE PAGE (DoctorProfile.jsx)
// ==============================================================================
// Shows comprehensive doctor credentials, department affiliation,
// and the physician's 7-day consultation schedule before booking.

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const DoctorProfile = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await api.get(`/doctors/${id}`);
                setDoctor(res.data);
            } catch (err) {
                console.error("Error fetching doctor profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Doctor Profile & Availability</h2>
                        <p className="text-muted mb-0">Review clinical qualifications and consultation slots</p>
                    </div>
                    <Link to="/patient/doctors" className="btn btn-outline-secondary btn-sm">
                        &larr; Back to Doctor Directory
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading profile...</span>
                        </div>
                    </div>
                ) : doctor ? (
                    <div className="row g-4">
                        {/* Profile Details Card */}
                        <div className="col-lg-5">
                            <div className="card hms-card border-0 shadow-sm p-4 text-center">
                                <h3 className="fw-bold mb-1">{doctor.user?.name}</h3>
                                <div className="mb-3">
                                    <span className="badge bg-primary px-3 py-2 fs-6">
                                        {doctor.specialization?.name}
                                    </span>
                                </div>

                                <div className="text-start bg-light p-3 rounded-3 border mb-4">
                                    <div className="mb-2">
                                        <strong>Medical Qualifications:</strong>
                                        <div>{doctor.qualification}</div>
                                    </div>
                                    <div className="mb-2">
                                        <strong>Years of Experience:</strong> {doctor.experience} Years
                                    </div>
                                    <div className="mb-2">
                                        <strong>Clinic / Office:</strong> {doctor.user?.address || "Medical Arts Center"}
                                    </div>
                                    <div>
                                        <strong>Contact Phone:</strong> {doctor.user?.phone || "Hospital Extension"}
                                    </div>
                                </div>

                                <Link
                                    to={`/patient/appointments/book?doctor=${doctor._id}`}
                                    className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                                >
                                    Book Appointment with this Doctor
                                </Link>
                            </div>
                        </div>

                        {/* 7-Day Consultation Availability Schedule */}
                        <div className="col-lg-7">
                            <div className="card hms-card border-0 shadow-sm p-4">
                                <h4 className="fw-bold text-primary mb-3">
                                    Weekly Consultation Schedule
                                </h4>
                                <p className="text-muted small mb-4">
                                    Physician's standard active consultation hours across the 7 days of the week:
                                </p>

                                <div className="d-flex flex-column gap-3">
                                    {doctor.availability && doctor.availability.length > 0 ? (
                                        doctor.availability.map((sched) => (
                                            <div
                                                key={sched.day}
                                                className={`p-3 rounded-3 border ${sched.isAvailable ? "bg-white" : "bg-light opacity-75"}`}
                                            >
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="fw-bold fs-6">{sched.day}</span>
                                                    {sched.isAvailable ? (
                                                        <span className="badge bg-success-subtle text-success">
                                                            Available
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-secondary-subtle text-secondary">
                                                            Unavailable / Off
                                                        </span>
                                                    )}
                                                </div>
                                                {sched.isAvailable && sched.slots && sched.slots.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                                        {sched.slots.map((slot, sIdx) => (
                                                            <span key={sIdx} className="badge bg-light text-dark border px-2 py-1">
                                                                {slot}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    sched.isAvailable && (
                                                        <small className="text-muted">Standard on-call consultation</small>
                                                    )
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">No schedule published yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-danger">Doctor not found.</div>
                )}
            </main>
        </div>
    );
};

export default DoctorProfile;
