// ==============================================================================
// PATIENT PROFILE (PatientProfile.jsx)
// ==============================================================================
// Allows patients to review and update personal demographic information
// (name, contact phone, age, gender, residential address).

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";
import { formatIndianPhone, isValidIndianPhone } from "../../utils/phone";

const PatientProfile = () => {
    const { updateUser } = useAuth();
    const [patientId, setPatientId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "Male",
        address: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/me");
                const { user, profile } = res.data;

                if (profile) {
                    setPatientId(profile._id);
                    setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        phone: formatIndianPhone(profile.phone || user.phone || ""),
                        age: profile.age || "",
                        gender: profile.gender || "Male",
                        address: profile.address || user.address || ""
                    });
                }
            } catch (err) {
                console.error("Error loading profile:", err);
                setFeedback({ type: "danger", message: "Failed to load profile data" });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const value = e.target.name === "phone" ? formatIndianPhone(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ type: "", message: "" });

        if (!formData.name || !formData.age) {
            setFeedback({ type: "danger", message: "Name and Age are required" });
            return;
        }

        if (!isValidIndianPhone(formData.phone)) {
            setFeedback({ type: "danger", message: "Phone number must use the format +91 1111111111" });
            return;
        }

        try {
            setSaving(true);
            const res = await api.put(`/patients/${patientId}`, {
                name: formData.name,
                age: Number(formData.age),
                gender: formData.gender,
                phone: formData.phone,
                address: formData.address
            });

            // Update AuthContext memory
            updateUser({ name: formData.name, phone: formData.phone });

            setSaving(false);
            setFeedback({ type: "success", message: res.data.message });
        } catch (err) {
            setSaving(false);
            setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to update profile" });
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">My Patient Profile</h2>
                        <p className="text-muted mb-0">Manage your contact information and demographic details</p>
                    </div>
                </div>

                <AlertMessage
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback({ type: "", message: "" })}
                />

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading profile...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card hms-card border-0 shadow-sm p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        {/* Name */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Full Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Email (Read only) */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control bg-light"
                                                value={formData.email}
                                                disabled
                                            />
                                            <small className="text-muted">Email is used for account login</small>
                                        </div>

                                        {/* Phone */}
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

                                        {/* Age */}
                                        <div className="col-md-3">
                                            <label className="form-label fw-semibold">Age (Years) *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="age"
                                                min="0"
                                                value={formData.age}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div className="col-md-3">
                                            <label className="form-label fw-semibold">Gender *</label>
                                            <select
                                                className="form-select"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        {/* Address */}
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Residential Address</label>
                                            <textarea
                                                className="form-control"
                                                name="address"
                                                rows="3"
                                                value={formData.address}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mt-4">
                                        <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                                            {saving ? "Saving Updates..." : "Save Profile Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PatientProfile;
