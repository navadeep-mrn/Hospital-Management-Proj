// ==============================================================================
// MAIN APP COMPONENT (App.jsx)
// ==============================================================================
// Configures React Router routes and integrates role-based route protection.
// Wraps the application inside AuthProvider to provide global authentication state.

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import AddDoctor from "./pages/admin/AddDoctor";
import EditDoctor from "./pages/admin/EditDoctor";
import ManagePatients from "./pages/admin/ManagePatients";
import ManageAppointments from "./pages/admin/ManageAppointments";
import ManageSpecializations from "./pages/admin/ManageSpecializations";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorPatientDetail from "./pages/doctor/DoctorPatientDetail";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorSearch from "./pages/patient/DoctorSearch";
import DoctorProfile from "./pages/patient/DoctorProfile";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientHistory from "./pages/patient/PatientHistory";
import PatientProfile from "./pages/patient/PatientProfile";

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Top Navbar */}
            <Navbar />

            {/* Route Definitions */}
            <div className="flex-grow-1">
                <Routes>
                    {/* ------------------------------------------------------ */}
                    {/* PUBLIC ROUTES */}
                    {/* ------------------------------------------------------ */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* ------------------------------------------------------ */}
                    {/* ADMIN PROTECTED ROUTES */}
                    {/* ------------------------------------------------------ */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/doctors"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <ManageDoctors />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/doctors/add"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AddDoctor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/doctors/edit/:id"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <EditDoctor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/patients"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <ManagePatients />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/appointments"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <ManageAppointments />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/specializations"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <ManageSpecializations />
                            </ProtectedRoute>
                        }
                    />

                    {/* ------------------------------------------------------ */}
                    {/* DOCTOR PROTECTED ROUTES */}
                    {/* ------------------------------------------------------ */}
                    <Route
                        path="/doctor/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["doctor"]}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/doctor/appointments"
                        element={
                            <ProtectedRoute allowedRoles={["doctor"]}>
                                <DoctorAppointments />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/doctor/patients"
                        element={
                            <ProtectedRoute allowedRoles={["doctor"]}>
                                <DoctorPatients />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/doctor/patients/:id"
                        element={
                            <ProtectedRoute allowedRoles={["doctor"]}>
                                <DoctorPatientDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/doctor/availability"
                        element={
                            <ProtectedRoute allowedRoles={["doctor"]}>
                                <DoctorAvailability />
                            </ProtectedRoute>
                        }
                    />

                    {/* ------------------------------------------------------ */}
                    {/* PATIENT PROTECTED ROUTES */}
                    {/* ------------------------------------------------------ */}
                    <Route
                        path="/patient/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["patient"]}>
                                <PatientDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patient/doctors"
                        element={
                            <ProtectedRoute allowedRoles={["patient"]}>
                                <DoctorSearch />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patient/doctors/:id"
                        element={
                            <ProtectedRoute allowedRoles={["patient"]}>
                                <DoctorProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patient/appointments"
                        element={
                            <ProtectedRoute allowedRoles={["patient"]}>
                                <PatientAppointments />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patient/appointments/book"
                        element={
                            <ProtectedRoute allowedRoles={["patient"]}>
                                <BookAppointment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patient/history"
                        element={
                            <ProtectedRoute allowedRoles={["patient"]}>
                                <PatientHistory />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/patient/profile"
                        element={
                            <ProtectedRoute allowedRoles={["patient"]}>
                                <PatientProfile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
