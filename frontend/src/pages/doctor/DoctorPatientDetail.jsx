// DOCTOR PATIENT DETAIL (DoctorPatientDetail.jsx)
// Displays a patient's complete clinical record, previous diagnoses,
// prescriptions, and consultation notes to aid in diagnostic continuity.

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const DoctorPatientDetail = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientAndHistory = async () => {
            try {
                const [patientRes, treatRes] = await Promise.all([
                    api.get(`/patients/${id}`),
                    api.get(`/treatments/patient/${id}`)
                ]);
                setPatient(patientRes.data);
                setTreatments(treatRes.data);
            } catch (err) {
                console.error("Error fetching patient details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientAndHistory();
    }, [id]);

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Patient Clinical File</h2>
                        <p className="text-muted mb-0">Medical profile and chronological consultation history</p>
                    </div>
                    <Link to="/doctor/patients" className="btn btn-outline-secondary btn-sm">
                        &larr; Back to Patients
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading patient file...</span>
                        </div>
                    </div>
                ) : patient ? (
                    <>
                        {/* Demographic Summary Card */}
                        <div className="card hms-card border-0 mb-4 p-4 shadow-sm">
                            <div className="row align-items-center">
                                <div className="col-md-2 text-center text-md-start">
                                </div>
                                <div className="col-md-5">
                                    <h4 className="fw-bold mb-1">{patient.user?.name}</h4>
                                    <p className="text-muted mb-0">{patient.user?.email}</p>
                                    <small className="text-muted">
                                        Phone: {patient.phone || patient.user?.phone || "N/A"}
                                    </small>
                                </div>
                                <div className="col-md-5">
                                    <div className="bg-light p-3 rounded-3 border">
                                        <div><strong>Age:</strong> {patient.age} years old</div>
                                        <div><strong>Gender:</strong> {patient.gender}</div>
                                        <div><strong>Address:</strong> {patient.address || patient.user?.address || "N/A"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chronological Treatment History */}
                        <h4 className="fw-bold mb-3">Previous Diagnoses & Prescriptions ({treatments.length})</h4>

                        {treatments.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {treatments.map((record) => (
                                    <div key={record._id} className="card hms-card border-0 shadow-sm p-4">
                                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 border-bottom pb-2">
                                            <div>
                                                <h5 className="fw-bold text-primary mb-0">
                                                    Diagnosis: {record.diagnosis}
                                                </h5>
                                                <small className="text-muted">
                                                    Treated by: {record.doctor?.user?.name} ({record.doctor?.specialization?.name})
                                                </small>
                                            </div>
                                            <span className="badge bg-light text-dark border px-3 py-2">
                                                {record.appointment?.date || new Date(record.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <h6 className="fw-bold text-success mb-2">Prescription & Medications</h6>
                                            <div className="p-3 bg-light rounded-3 border font-monospace small" style={{ whiteSpace: "pre-line" }}>
                                                {record.prescription}
                                            </div>
                                        </div>

                                        {record.notes && (
                                            <div>
                                                <h6 className="fw-bold text-secondary mb-1">Clinical Notes & Advice</h6>
                                                <p className="text-muted small mb-0">{record.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card hms-card border-0 p-5 text-center text-muted">
                                No prior treatment records found for this patient.
                            </div>
                        )}
                    </>
                ) : (
                    <div className="alert alert-danger">Patient not found.</div>
                )}
            </main>
        </div>
    );
};

export default DoctorPatientDetail;
