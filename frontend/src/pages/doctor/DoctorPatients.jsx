// ==============================================================================
// DOCTOR PATIENTS DIRECTORY (DoctorPatients.jsx)
// ==============================================================================
// Displays patients who have booked or completed consultations with this doctor.
// Provides direct access to each patient's past treatment and prescription records.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTreatedPatients = async () => {
            try {
                // Fetch appointments for this doctor to discover all treated patients
                const res = await api.get("/appointments");
                const appointments = res.data;

                // Group unique patients by patient._id
                const patientMap = {};
                appointments.forEach((appt) => {
                    if (appt.patient && !patientMap[appt.patient._id]) {
                        patientMap[appt.patient._id] = {
                            ...appt.patient,
                            visitCount: 1,
                            lastVisit: appt.date
                        };
                    } else if (appt.patient) {
                        patientMap[appt.patient._id].visitCount += 1;
                    }
                });

                setPatients(Object.values(patientMap));
            } catch (err) {
                console.error("Error loading doctor patients:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTreatedPatients();
    }, []);

    const filteredPatients = patients.filter((p) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        const name = p.user?.name?.toLowerCase() || "";
        const phone = p.phone || p.user?.phone || "";
        return name.includes(q) || phone.includes(q);
    });

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">My Patients</h2>
                        <p className="text-muted mb-0">Directory of patients who have consulted with you</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="card hms-card border-0 mb-4 p-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search patient by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Patients Table */}
                <div className="card hms-card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Demographics</th>
                                    <th>Phone / Contact</th>
                                    <th>Total Consultations</th>
                                    <th className="text-end">Medical History</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            Loading patients...
                                        </td>
                                    </tr>
                                ) : filteredPatients.length > 0 ? (
                                    filteredPatients.map((p) => (
                                        <tr key={p._id}>
                                            <td className="fw-semibold">
                                                {p.user?.name || "Patient"}
                                                <br />
                                                <small className="text-muted fw-normal">{p.user?.email}</small>
                                            </td>
                                            <td>
                                                {p.age} years old, {p.gender}
                                            </td>
                                            <td>
                                                <small>{p.phone || p.user?.phone || "N/A"}</small>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary-subtle text-secondary px-3 py-1">
                                                    {p.visitCount} visits
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <Link to={`/doctor/patients/${p._id}`} className="btn btn-outline-primary btn-sm">
                                                    View Treatment Records &rarr;
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No patients found.
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

export default DoctorPatients;
