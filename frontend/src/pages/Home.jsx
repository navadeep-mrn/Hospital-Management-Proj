// ==============================================================================
// LANDING PAGE (Home.jsx)
// ==============================================================================
// Modern hospital homepage: Black, White, Grey, and Blue minimalist healthcare palette.
// Introduces clinical departments, featured doctors, and conflict-free booking.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = () => {
    const [departments, setDepartments] = useState([]);
    const [featuredDoctors, setFeaturedDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [deptRes, docRes] = await Promise.all([
                    api.get("/specializations"),
                    api.get("/doctors?availableOnly=true")
                ]);
                setDepartments(deptRes.data);
                setFeaturedDoctors(docRes.data.slice(0, 3));
            } catch (err) {
                console.error("Error fetching homepage data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    return (
        <div>
            {/* -------------------------------------------------------------- */}
            {/* HERO SECTION */}
            {/* -------------------------------------------------------------- */}
            <section className="container my-4">
                <div className="hero-banner p-4 p-md-5 text-center text-md-start">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <span className="badge bg-white text-dark px-3 py-2 mb-3 rounded-pill fw-semibold border">
                                24/7 Verified Healthcare Excellence
                            </span>
                            <h1 className="display-4 fw-bold mb-3 text-white">
                                Exceptional Care for Every Patient, Every Day
                            </h1>
                            <p className="lead mb-4 text-light opacity-90">
                                Connect with specialized doctors, schedule consultations with zero double-booking,
                                and manage your medical records seamlessly in one unified platform.
                            </p>
                            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                                <Link to="/patient/appointments/book" className="btn btn-primary btn-lg fw-bold px-4 shadow-sm">
                                    Book an Appointment
                                </Link>
                                <Link to="/patient/doctors" className="btn btn-outline-light btn-lg px-4">
                                    Find a Doctor
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* KEY METRICS & TRUST STATS */}
            {/* -------------------------------------------------------------- */}
            <section className="container my-5">
                <div className="row g-4 text-center">
                    <div className="col-6 col-md-3">
                        <div className="p-3 bg-white rounded-3 border hms-card">
                            <h2 className="fw-bold text-dark mb-1">50+</h2>
                            <p className="text-muted mb-0">Specialist Doctors</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-3 bg-white rounded-3 border hms-card">
                            <h2 className="fw-bold text-primary mb-1">24/7</h2>
                            <p className="text-muted mb-0">Emergency Support</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-3 bg-white rounded-3 border hms-card">
                            <h2 className="fw-bold text-dark mb-1">8+</h2>
                            <p className="text-muted mb-0">Clinical Specialties</p>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="p-3 bg-white rounded-3 border hms-card">
                            <h2 className="fw-bold text-primary mb-1">100%</h2>
                            <p className="text-muted mb-0">Digital Records</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* CLINICAL DEPARTMENTS */}
            {/* -------------------------------------------------------------- */}
            <section className="container my-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark">Our Medical Specialties</h2>
                    <p className="text-muted">Comprehensive care across diverse clinical disciplines</p>
                </div>

                <div className="row g-3">
                    {departments.map((dept) => (
                        <div key={dept._id} className="col-md-4 col-lg-3">
                            <div className="card h-100 hms-card border-0 p-3">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-dark">{dept.name}</h5>
                                    <p className="card-text text-muted small">{dept.description || "Expert consultations and comprehensive diagnostics."}</p>
                                    <Link to={`/patient/doctors?specialization=${dept._id}`} className="btn btn-sm btn-outline-primary mt-2">
                                        View Specialists &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* WHY CHOOSE CAREPOINT */}
            {/* -------------------------------------------------------------- */}
            <section className="bg-white py-5 border-top border-bottom my-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-dark">Why Patients Trust CarePoint</h2>
                        <p className="text-muted">Designed for clarity, punctuality, and patient-centered healing</p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4 text-center">
                            <h4 className="fw-bold text-dark">Conflict-Free Booking</h4>
                            <p className="text-muted">
                                Our automated slot verification ensures zero double-booking, guaranteeing that
                                your designated time slot is reserved exclusively for you.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <h4 className="fw-bold text-dark">Instant Medical History</h4>
                            <p className="text-muted">
                                Access your doctor's clinical diagnoses, digital prescriptions, and dietary advice
                                anytime securely from your patient portal.
                            </p>
                        </div>
                        <div className="col-md-4 text-center">
                            <h4 className="fw-bold text-dark">Verified Medical Experts</h4>
                            <p className="text-muted">
                                Consult with experienced, credentialed doctors across Cardiology, Neurology,
                                Pediatrics, and more.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* FEATURED DOCTORS */}
            {/* -------------------------------------------------------------- */}
            <section className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Meet Our Specialists</h2>
                        <p className="text-muted mb-0">Book your consultation with top medical practitioners</p>
                    </div>
                    <Link to="/patient/doctors" className="btn btn-outline-primary">
                        Browse All Doctors &rarr;
                    </Link>
                </div>

                <div className="row g-4">
                    {featuredDoctors.map((doc) => (
                        <div key={doc._id} className="col-md-4">
                            <div className="card h-100 hms-card border-0">
                                <div className="card-body p-4 text-center">
                                    <h5 className="card-title fw-bold text-dark mb-1">{doc.user?.name}</h5>
                                    <p className="badge bg-light text-primary border mb-2">
                                        {doc.specialization?.name}
                                    </p>
                                    <p className="text-muted small mb-2">{doc.qualification}</p>
                                    <p className="text-muted small mb-3">
                                        <strong>{doc.experience} Years</strong> Clinical Experience
                                    </p>
                                    <Link to={`/patient/doctors/${doc._id}`} className="btn btn-outline-primary btn-sm w-100">
                                        View Profile & Schedule
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* -------------------------------------------------------------- */}
            {/* FOOTER */}
            {/* -------------------------------------------------------------- */}
            <footer className="navbar-custom text-white py-4 mt-5 border-top border-secondary">
                <div className="container text-center text-md-start">
                    <div className="row gy-3 align-items-center">
                        <div className="col-md-6">
                            <h5 className="fw-bold text-white mb-1">CarePoint Hospital Management System</h5>
                            <p className="text-secondary small mb-0">
                                A Complete MERN Stack Healthcare Solution built for college demonstration.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
