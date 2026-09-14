// MANAGE SPECIALIZATIONS PAGE (ManageSpecializations.jsx)
// Admin management of medical departments / clinical specialties.
// View, add, and remove departments from the hospital system.

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";

const ManageSpecializations = () => {
    const [specializations, setSpecializations] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const loadSpecializations = async () => {
        try {
            setLoading(true);
            const res = await api.get("/specializations");
            setSpecializations(res.data);
        } catch (err) {
            console.error("Error loading specializations:", err);
            setFeedback({ type: "danger", message: "Failed to load hospital departments" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSpecializations();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setSaving(true);
            const res = await api.post("/specializations", { name, description });
            setFeedback({ type: "success", message: res.data.message });
            setName("");
            setDescription("");
            loadSpecializations();
        } catch (err) {
            setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to add department" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, specName) => {
        if (!window.confirm(`Are you sure you want to delete ${specName}?`)) return;

        try {
            const res = await api.delete(`/specializations/${id}`);
            setFeedback({ type: "success", message: res.data.message });
            loadSpecializations();
        } catch (err) {
            setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to delete department" });
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Clinical Departments & Specializations</h2>
                        <p className="text-muted mb-0">Organize hospital departments and specialist categories</p>
                    </div>
                </div>

                <AlertMessage
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback({ type: "", message: "" })}
                />

                <div className="row g-4">
                    {/* Add Department Form */}
                    <div className="col-lg-4">
                        <div className="card hms-card border-0 shadow-sm p-3">
                            <h5 className="fw-bold mb-3">➕ Add New Department</h5>
                            <form onSubmit={handleCreate}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Department Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Oncology, Urology"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Department Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Brief overview of clinical focus..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                                    {saving ? "Adding..." : "Save Department"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Department List */}
                    <div className="col-lg-8">
                        <div className="card hms-card border-0 shadow-sm">
                            <div className="hms-card-header">
                                Active Medical Departments ({specializations.length})
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Department Name</th>
                                            <th>Description</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-muted">
                                                    Loading departments...
                                                </td>
                                            </tr>
                                        ) : specializations.length > 0 ? (
                                            specializations.map((spec) => (
                                                <tr key={spec._id}>
                                                    <td className="fw-bold text-primary">{spec.name}</td>
                                                    <td className="small text-muted">{spec.description || "N/A"}</td>
                                                    <td className="text-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDelete(spec._id, spec.name)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-muted">
                                                    No departments defined yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManageSpecializations;
