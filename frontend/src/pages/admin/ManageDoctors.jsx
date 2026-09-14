// ==============================================================================
// MANAGE DOCTORS PAGE (ManageDoctors.jsx)
// ==============================================================================
// Administrative doctor management view:
// - View list of all hospital doctors with credentials & specialization
// - Search doctors by name or specialization
// - Filter by department
// - Toggle doctor active/inactive status
// - Delete doctor profile and account

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpec, setSelectedSpec] = useState("");
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    // Load doctors and specializations
    const loadData = async () => {
        try {
            setLoading(true);
            const [docRes, specRes] = await Promise.all([
                api.get(`/doctors?search=${searchTerm}&specialization=${selectedSpec}`),
                api.get("/specializations")
            ]);
            setDoctors(docRes.data);
            setSpecializations(specRes.data);
        } catch (err) {
            console.error("Error loading doctors:", err);
            setFeedback({ type: "danger", message: "Failed to load doctor records" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [searchTerm, selectedSpec]);

    // Toggle active / inactive status
    const handleToggleStatus = async (doctorId, currentActive) => {
        try {
            const res = await api.patch(`/doctors/${doctorId}/status`);
            setFeedback({ type: "success", message: res.data.message });
            loadData();
        } catch (err) {
            setFeedback({ type: "danger", message: "Failed to update doctor status" });
        }
    };

    // Delete doctor
    const handleDelete = async (doctorId, doctorName) => {
        if (!window.confirm(`Are you sure you want to delete ${doctorName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await api.delete(`/doctors/${doctorId}`);
            setFeedback({ type: "success", message: res.data.message });
            loadData();
        } catch (err) {
            setFeedback({ type: "danger", message: "Failed to delete doctor" });
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                    <div>
                        <h2 className="fw-bold mb-1">Doctor Management</h2>
                        <p className="text-muted mb-0">View, add, edit, and manage hospital medical staff</p>
                    </div>
                    <Link to="/admin/doctors/add" className="btn btn-primary">
                        ➕ Add New Doctor
                    </Link>
                </div>

                <AlertMessage
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback({ type: "", message: "" })}
                />

                {/* Search & Filter Controls */}
                <div className="card hms-card border-0 mb-4 p-3">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by doctor name or department..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={selectedSpec}
                                onChange={(e) => setSelectedSpec(e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {specializations.map((spec) => (
                                    <option key={spec._id} value={spec._id}>
                                        {spec.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedSpec("");
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctors Table */}
                <div className="card hms-card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Doctor Name</th>
                                    <th>Department</th>
                                    <th>Qualification & Exp</th>
                                    <th>Contact</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            Loading doctors...
                                        </td>
                                    </tr>
                                ) : doctors.length > 0 ? (
                                    doctors.map((doc) => (
                                        <tr key={doc._id}>
                                            <td className="fw-semibold">
                                                {doc.user?.name}
                                                <br />
                                                <small className="text-muted fw-normal">{doc.user?.email}</small>
                                            </td>
                                            <td>
                                                <span className="badge bg-primary-subtle text-primary">
                                                    {doc.specialization?.name || "General"}
                                                </span>
                                            </td>
                                            <td>
                                                <small className="fw-semibold">{doc.qualification}</small>
                                                <br />
                                                <small className="text-muted">{doc.experience} years experience</small>
                                            </td>
                                            <td>
                                                <small>{doc.user?.phone || "N/A"}</small>
                                            </td>
                                            <td>
                                                {doc.user?.isActive ? (
                                                    <span className="badge bg-success-subtle text-success">Active</span>
                                                ) : (
                                                    <span className="badge bg-danger-subtle text-danger">Deactivated</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <div className="btn-group btn-group-sm">
                                                    <Link to={`/admin/doctors/edit/${doc._id}`} className="btn btn-outline-primary">
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className={`btn ${doc.user?.isActive ? "btn-outline-warning" : "btn-outline-success"}`}
                                                        onClick={() => handleToggleStatus(doc._id, doc.user?.isActive)}
                                                        title={doc.user?.isActive ? "Deactivate Doctor" : "Activate Doctor"}
                                                    >
                                                        {doc.user?.isActive ? "Deactivate" : "Activate"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDelete(doc._id, doc.user?.name)}
                                                        title="Delete Doctor"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No doctors found matching the search criteria.
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

export default ManageDoctors;
