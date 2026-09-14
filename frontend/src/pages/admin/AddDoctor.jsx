// ==============================================================================
// ADD DOCTOR PAGE (AddDoctor.jsx)
// ==============================================================================
// Admin form to register a new doctor into the hospital system.
// Simultaneously generates their User login account and linked Doctor clinical profile.

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";
import { formatIndianPhone, isValidIndianPhone } from "../../utils/phone";

const AddDoctor = () => {
    const navigate = useNavigate();
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "doctor123", // default initial password
        phone: "",
        address: "",
        specialization: "",
        qualification: "",
        experience: "5"
    });

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const res = await api.get("/specializations");
                setSpecializations(res.data);
                if (res.data.length > 0) {
                    setFormData((prev) => ({ ...prev, specialization: res.data[0]._id }));
                }
            } catch (err) {
                console.error("Error loading specializations:", err);
            }
        };
        fetchSpecializations();
    }, []);

    const handleChange = (e) => {
        const value = e.target.name === "phone" ? formatIndianPhone(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.email || !formData.password || !formData.specialization || !formData.qualification) {
            setError("Please fill in all required fields");
            return;
        }

        if (!isValidIndianPhone(formData.phone)) {
            setError("Phone number must use the format +91 1111111111");
            return;
        }

        try {
            setLoading(true);
            await api.post("/doctors", {
                ...formData,
                experience: Number(formData.experience)
            });
            setLoading(false);
            navigate("/admin/doctors");
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Failed to create doctor account");
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Add New Doctor</h2>
                        <p className="text-muted mb-0">Create medical staff account and assign specialization</p>
                    </div>
                    <Link to="/admin/doctors" className="btn btn-outline-secondary btn-sm">
                        &larr; Back to Doctors
                    </Link>
                </div>

                <AlertMessage type="danger" message={error} onClose={() => setError("")} />

                <div className="card hms-card border-0 shadow-sm p-4">
                    <form onSubmit={handleSubmit}>
                        <h5 className="fw-bold text-primary mb-3">1. Login & Contact Information</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Doctor Full Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="e.g. Dr. Robert Smith"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Email Address *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="doctor@hospital.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Initial Password *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <small className="text-muted">Doctor can change this upon initial login</small>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="phone"
                                    placeholder="+91 1111111111"
                                    pattern="[+]91 [0-9]{10}"
                                    maxLength="14"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-semibold">Office / Clinic Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    placeholder="Suite 302, Medical Arts Wing"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <h5 className="fw-bold text-primary mb-3">2. Medical Credentials & Department</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Specialization / Department *</label>
                                <select
                                    className="form-select"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                >
                                    {specializations.map((spec) => (
                                        <option key={spec._id} value={spec._id}>
                                            {spec.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Years of Experience *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="experience"
                                    min="0"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-semibold">Medical Qualifications & Degrees *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="qualification"
                                    placeholder="e.g. MBBS, MD (Cardiology), FACC"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/admin/doctors" className="btn btn-secondary">
                                Cancel
                            </Link>
                            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                                {loading ? "Adding Doctor..." : "Save Doctor"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddDoctor;
