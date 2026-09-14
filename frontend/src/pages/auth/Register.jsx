// ==============================================================================
// PATIENT REGISTRATION PAGE (Register.jsx)
// ==============================================================================
// Allows new patients to register their demographic and login information.
// Automatically hashes password on the backend, saves both User and Patient records,
// and issues a JWT token for instant login upon submission.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertMessage from "../../components/AlertMessage";
import { formatIndianPhone, isValidIndianPhone } from "../../utils/phone";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "Male",
        phone: "",
        address: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.name === "phone" ? formatIndianPhone(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.email || !formData.password || !formData.age || !formData.gender) {
            setError("Please fill in all required fields");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (!isValidIndianPhone(formData.phone)) {
            setError("Phone number must use the format +91 1111111111");
            return;
        }

        try {
            setLoading(true);
            await register({
                ...formData,
                age: Number(formData.age)
            });
            setLoading(false);
            navigate("/patient/dashboard");
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card hms-card border-0 shadow-sm p-3 p-md-4">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold">Patient Registration</h3>
                                <p className="text-muted small">
                                    Register as a new patient to book consultations and access medical records
                                </p>
                            </div>

                            <AlertMessage type="danger" message={error} onClose={() => setError("")} />

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    {/* Full Name */}
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Full Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="e.g. John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Email Address *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Password *</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="Min 6 characters"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Age */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Age *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="age"
                                            placeholder="e.g. 28"
                                            min="0"
                                            value={formData.age}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Gender *</label>
                                        <select
                                            className="form-select"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            placeholder="e.g. +91 1111111111"
                                            pattern="[+]91 [0-9]{10}"
                                            maxLength="14"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Residential Address */}
                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Residential Address</label>
                                        <textarea
                                            className="form-control"
                                            name="address"
                                            rows="2"
                                            placeholder="e.g. 123 Main Street, Springfield"
                                            value={formData.address}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 fw-semibold shadow-sm mt-4 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? "Creating Account..." : "Complete Registration"}
                                </button>
                            </form>

                            <div className="text-center mt-2">
                                <small className="text-muted">
                                    Already registered?{" "}
                                    <Link to="/login" className="text-decoration-none fw-semibold">
                                        Sign In Here
                                    </Link>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
