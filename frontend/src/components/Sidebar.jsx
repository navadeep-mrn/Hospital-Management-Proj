// ==============================================================================
// SIDEBAR COMPONENT
// ==============================================================================
// Renders role-specific side navigation for dashboards.
// Dynamically adjusts navigation links based on whether the logged-in user
// is an Admin, Doctor, or Patient.

import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { role } = useAuth();

    return (
        <aside className="sidebar">
            <div className="mb-4 px-2">
                <small className="text-uppercase fw-bold text-muted" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                    Navigation
                </small>
            </div>

            <nav className="nav flex-column">
                {/* ---------------------------------------------------------- */}
                {/* ADMIN NAVIGATION LINKS */}
                {/* ---------------------------------------------------------- */}
                {role === "admin" && (
                    <>
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/doctors" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Manage Doctors
                        </NavLink>
                        <NavLink to="/admin/patients" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Manage Patients
                        </NavLink>
                        <NavLink to="/admin/appointments" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            All Appointments
                        </NavLink>
                        <NavLink to="/admin/specializations" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Departments
                        </NavLink>
                    </>
                )}

                {/* ---------------------------------------------------------- */}
                {/* DOCTOR NAVIGATION LINKS */}
                {/* ---------------------------------------------------------- */}
                {role === "doctor" && (
                    <>
                        <NavLink to="/doctor/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/doctor/appointments" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            My Appointments
                        </NavLink>
                        <NavLink to="/doctor/patients" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Treated Patients
                        </NavLink>
                        <NavLink to="/doctor/availability" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Manage Availability
                        </NavLink>
                    </>
                )}

                {/* ---------------------------------------------------------- */}
                {/* PATIENT NAVIGATION LINKS */}
                {/* ---------------------------------------------------------- */}
                {role === "patient" && (
                    <>
                        <NavLink to="/patient/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/patient/doctors" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Find Doctors
                        </NavLink>
                        <NavLink to="/patient/appointments/book" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Book Appointment
                        </NavLink>
                        <NavLink to="/patient/appointments" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            My Appointments
                        </NavLink>
                        <NavLink to="/patient/history" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            Medical History
                        </NavLink>
                        <NavLink to="/patient/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                            My Profile
                        </NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
