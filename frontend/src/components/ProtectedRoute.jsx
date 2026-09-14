// PROTECTED ROUTE COMPONENT
// Guards frontend routes by verifying authentication and role authorization:
// 1. If user is not logged in -> redirects to /login.
// 2. If user's role is not allowed for this route -> redirects to their proper dashboard.
// 3. While auth session is restoring from localStorage -> displays a loading spinner.

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, role, loading } = useAuth();

    // While checking stored JWT token on app load
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // 1. Not authenticated -> Redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Role not authorized -> Redirect to the user's appropriate portal
    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
        if (role === "doctor") return <Navigate to="/doctor/dashboard" replace />;
        if (role === "patient") return <Navigate to="/patient/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    // User is authenticated and authorized -> render component
    return children;
};

export default ProtectedRoute;
