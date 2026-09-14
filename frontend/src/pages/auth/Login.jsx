// ==============================================================================
// LOGIN PAGE (Login.jsx)
// ==============================================================================
// Universal login portal for all three roles: Admin, Doctor, and Patient.
// Submits email and password to Express, receives JWT token, stores it in AuthContext,
// and redirects the user to their designated dashboard.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertMessage from "../../components/AlertMessage";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // --------------------------------------------------------------------------
    // Handle Form Submission
    // --------------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please provide both email and password");
            return;
        }

        try {
            setLoading(true);
            const loggedInUser = await login(email, password);
            setLoading(false);

            // Redirect dynamically based on the authenticated user's role
            if (loggedInUser.role === "admin") {
                navigate("/admin/dashboard");
            } else if (loggedInUser.role === "doctor") {
                navigate("/doctor/dashboard");
            } else if (loggedInUser.role === "patient") {
                navigate("/patient/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Invalid email or password");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5">
                    <div className="card hms-card border-0 shadow-sm p-3 p-md-4">
                        <div className="card-body">
                            {/* Header */}
                            <div className="text-center mb-4">
                                <h3 className="fw-bold">Sign In to CarePoint</h3>
                                <p className="text-muted small">
                                    Access your hospital account using your credentials
                                </p>
                            </div>

                            {/* Error Alert */}
                            <AlertMessage type="danger" message={error} onClose={() => setError("")} />

                            {/* Login Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 fw-semibold shadow-sm mb-3"
                                    disabled={loading}
                                >
                                    {loading ? "Authenticating..." : "Sign In"}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <small className="text-muted">
                                    New patient?{" "}
                                    <Link to="/register" className="text-decoration-none fw-semibold">
                                        Create an Account
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

export default Login;
