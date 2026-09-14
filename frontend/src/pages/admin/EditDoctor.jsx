// EDIT DOCTOR PAGE (EditDoctor.jsx)
// Admin form to update an existing doctor's profile, qualifications,
// contact information, and medical specialization.

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";
import { formatIndianPhone, isValidIndianPhone } from "../../utils/phone";

const EditDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        specialization: "",
        qualification: "",
        experience: "",
        isAvailable: true
    });

    useEffect(() => {
        const fetchDoctorAndSpecs = async () => {
            try {
                const [docRes, specRes] = await Promise.all([
                    api.get(`/doctors/${id}`),
                    api.get("/specializations")
                ]);

                const doc = docRes.data;
                setSpecializations(specRes.data);
                setFormData({
                    name: doc.user?.name || "",
                    phone: formatIndianPhone(doc.user?.phone || ""),
                    address: doc.user?.address || "",
                    specialization: doc.specialization?._id || doc.specialization || "",
                    qualification: doc.qualification || "",
                    experience: doc.experience || 0,
                    isAvailable: doc.isAvailable !== undefined ? doc.isAvailable : true
                });
            } catch (err) {
                console.error("Error fetching doctor:", err);
                setError("Failed to load doctor profile");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorAndSpecs();
    }, [id]);

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: e.target.name === "phone" ? formatIndianPhone(value) : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!isValidIndianPhone(formData.phone)) {
            setError("Phone number must use the format +91 1111111111");
            return;
        }

        try {
            setSaving(true);
            await api.put(`/doctors/${id}`, {
                ...formData,
                experience: Number(formData.experience)
            });
            setSaving(false);
            navigate("/admin/doctors");
        } catch (err) {
            setSaving(false);
            setError(err.response?.data?.message || "Failed to update doctor profile");
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Edit Doctor Profile</h2>
                        <p className="text-muted mb-0">Modify qualifications, clinical specialization, or contact details</p>
                    </div>
                    <Link to="/admin/doctors" className="btn btn-outline-secondary btn-sm">
                        &larr; Back to Doctors
                    </Link>
                </div>

                <AlertMessage type="danger" message={error} onClose={() => setError("")} />

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading doctor...</span>
                        </div>
                    </div>
                ) : (
                    <div className="card hms-card border-0 shadow-sm p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Doctor Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
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
                                    <label className="form-label fw-semibold">Qualification *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Office Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <div className="form-check form-switch mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isAvailableSwitch"
                                            name="isAvailable"
                                            checked={formData.isAvailable}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="isAvailableSwitch">
                                            Doctor is Available for New Appointments
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <Link to="/admin/doctors" className="btn btn-secondary">
                                    Cancel
                                </Link>
                                <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                                    {saving ? "Saving Changes..." : "Update Doctor"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default EditDoctor;
