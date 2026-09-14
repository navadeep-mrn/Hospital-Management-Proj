// PATIENT MEDICAL HISTORY (PatientHistory.jsx)
// Displays the patient's chronological medical and treatment records.
// Gives access to doctor diagnoses, prescriptions, and lifestyle/dietary notes
// recorded across all completed hospital consultations.

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const PatientHistory = () => {
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // First get current user to obtain their patient ID
                const meRes = await api.get("/auth/me");
                if (meRes.data.profile) {
                    const patientId = meRes.data.profile._id;
                    const res = await api.get(`/treatments/patient/${patientId}`);
                    setTreatments(res.data);
                }
            } catch (err) {
                console.error("Error loading medical history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">My Medical History & Prescriptions</h2>
                        <p className="text-muted mb-0">Records of completed clinical consultations and prescribed treatments</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading treatment records...</span>
                        </div>
                    </div>
                ) : treatments.length > 0 ? (
                    <div className="d-flex flex-column gap-4">
                        {treatments.map((record) => (
                            <div key={record._id} className="card hms-card border-0 shadow-sm p-4">
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 border-bottom pb-3">
                                    <div>
                                        <h4 className="fw-bold text-primary mb-1">
                                            Diagnosis: {record.diagnosis}
                                        </h4>
                                        <div className="text-muted small">
                                            Consulting Doctor: <strong>Dr. {record.doctor?.user?.name}</strong> (
                                            {record.doctor?.specialization?.name})
                                        </div>
                                    </div>
                                    <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                                        {record.appointment?.date || new Date(record.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Prescriptions */}
                                <div className="mb-3">
                                    <h6 className="fw-bold text-success mb-2">
                                        Prescribed Medications & Dosage
                                    </h6>
                                    <div
                                        className="p-3 bg-light rounded-3 border font-monospace text-dark"
                                        style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}
                                    >
                                        {record.prescription}
                                    </div>
                                </div>

                                {/* Clinical Notes */}
                                {record.notes && (
                                    <div className="bg-light-subtle p-3 rounded-3 border">
                                        <h6 className="fw-bold text-secondary mb-1">
                                            Doctor's Clinical Notes & Advice
                                        </h6>
                                        <p className="text-muted mb-0 small">{record.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card hms-card border-0 p-5 text-center text-muted">
                        <h5>No Treatment Records Yet</h5>
                        <p className="small mb-0">
                            Once a doctor completes an appointment with you and prescribes treatment,
                            your medical history will appear here.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PatientHistory;
