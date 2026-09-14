// MANAGE PATIENTS PAGE (ManagePatients.jsx)
// Administrative patient directory:
// - Search patients by name, email, or telephone number
// - View patient demographics (age, gender, address, registration date)
// - Block or unblock patient accounts

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";

const ManagePatients = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const loadPatients = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/patients?search=${searchTerm}`);
            setPatients(res.data);
        } catch (err) {
            console.error("Error loading patients:", err);
            setFeedback({ type: "danger", message: "Failed to load patient directory" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
    }, [searchTerm]);

    const handleToggleStatus = async (patientId) => {
        try {
            const res = await api.patch(`/patients/${patientId}/status`);
            setFeedback({ type: "success", message: res.data.message });
            loadPatients();
        } catch (err) {
            setFeedback({ type: "danger", message: "Failed to update patient status" });
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Patient Management</h2>
                        <p className="text-muted mb-0">Search patient records and manage account permissions</p>
                    </div>
                </div>

                <AlertMessage
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback({ type: "", message: "" })}
                />

                {/* Search Bar */}
                <div className="card hms-card border-0 mb-4 p-3">
                    <div className="row g-2">
                        <div className="col-md-10">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search patients by name, email, or phone number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-outline-secondary w-100" onClick={() => setSearchTerm("")}>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Patients Table */}
                <div className="card hms-card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Age & Gender</th>
                                    <th>Contact Details</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            Loading patient records...
                                        </td>
                                    </tr>
                                ) : patients.length > 0 ? (
                                    patients.map((p) => (
                                        <tr key={p._id}>
                                            <td className="fw-semibold">
                                                {p.user?.name}
                                                <br />
                                                <small className="text-muted fw-normal">{p.user?.email}</small>
                                            </td>
                                            <td>
                                                {p.age} yrs, {p.gender}
                                            </td>
                                            <td>
                                                <small>{p.phone || p.user?.phone || "N/A"}</small>
                                            </td>
                                            <td className="small text-muted" style={{ maxWidth: "200px" }}>
                                                {p.address || p.user?.address || "N/A"}
                                            </td>
                                            <td>
                                                {p.user?.isActive ? (
                                                    <span className="badge bg-success-subtle text-success">Active</span>
                                                ) : (
                                                    <span className="badge bg-danger-subtle text-danger">Blocked</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${p.user?.isActive ? "btn-outline-danger" : "btn-outline-success"}`}
                                                    onClick={() => handleToggleStatus(p._id)}
                                                >
                                                    {p.user?.isActive ? "Block Account" : "Unblock"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No patients found matching the search.
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

export default ManagePatients;
