// NAVBAR COMPONENT
// Primary top navigation bar. Displays the hospital brand, role-appropriate
// links, the active user's name and role badge, and the Logout button.
// Uses clean dark slate, pure white, and blue accents.

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Role-specific badge color using black, white, grey, and blue
    const getRoleBadge = () => {
        if (role === "admin") return <span className="badge bg-white text-dark border">Admin</span>;
        if (role === "doctor") return <span className="badge bg-primary">Doctor</span>;
        if (role === "patient") return <span className="badge bg-secondary">Patient</span>;
        return null;
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top py-2 shadow-sm">
            <div className="container-fluid px-3 px-md-4">
                {/* Brand Logo */}
                <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white" to="/">
                    <span>CarePoint Hospital</span>
                </Link>

                {/* Mobile Toggle Button */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible Content */}
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link text-light opacity-75" to="/">Home</Link>
                        </li>

                        {/* Direct link back to role dashboard if logged in */}
                        {user && role === "admin" && (
                            <li className="nav-item">
                                <Link className="nav-link text-white fw-semibold" to="/admin/dashboard">Admin Portal</Link>
                            </li>
                        )}
                        {user && role === "doctor" && (
                            <li className="nav-item">
                                <Link className="nav-link text-white fw-semibold" to="/doctor/dashboard">Doctor Portal</Link>
                            </li>
                        )}
                        {user && role === "patient" && (
                            <li className="nav-item">
                                <Link className="nav-link text-white fw-semibold" to="/patient/dashboard">Patient Portal</Link>
                            </li>
                        )}
                    </ul>

                    {/* Right side User Info & Actions */}
                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <div className="d-flex align-items-center gap-3">
                                <div className="d-flex flex-column align-items-end text-light">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="fw-semibold small">{user.name}</span>
                                        {getRoleBadge()}
                                    </div>
                                    <small className="text-secondary" style={{ fontSize: "0.75rem" }}>{user.email}</small>
                                </div>
                                <button onClick={handleLogout} className="btn btn-outline-light btn-sm px-3">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm px-3">
                                    Register Patient
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
