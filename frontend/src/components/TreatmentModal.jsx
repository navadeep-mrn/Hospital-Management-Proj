// ==============================================================================
// TREATMENT MODAL COMPONENT
// ==============================================================================
// Allows a doctor to complete an appointment by recording the patient's
// clinical diagnosis, medicine prescriptions, and follow-up consultation notes.
// Submitting this form marks the appointment as "Completed" in MongoDB.

import React, { useState } from "react";
import api from "../services/api";

const TreatmentModal = ({ appointment, onClose, onSuccess }) => {
    const [diagnosis, setDiagnosis] = useState("");
    const [prescription, setPrescription] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!appointment) return null;

    const patientName = appointment.patient?.user?.name || "Patient";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!diagnosis.trim() || !prescription.trim()) {
            setError("Diagnosis and prescription are required");
            return;
        }

        try {
            setLoading(true);
            await api.post("/treatments", {
                appointmentId: appointment._id,
                diagnosis,
                prescription,
                notes
            });
            setLoading(false);
            onSuccess();
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Failed to save treatment record");
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title fw-bold">
                            Complete Consultation & Add Treatment Record
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            {error && <div className="alert alert-danger py-2">{error}</div>}

                            <div className="p-3 bg-light rounded-3 mb-3 border">
                                <div className="row">
                                    <div className="col-md-6">
                                        <strong>Patient:</strong> {patientName}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Date & Time:</strong> {appointment.date} ({appointment.time})
                                    </div>
                                    <div className="col-12 mt-2">
                                        <strong>Reason for Visit:</strong> {appointment.reason}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Clinical Diagnosis *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Acute Bronchitis, Hypertension Stage 1"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Prescription & Medications *</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="e.g.&#10;1. Amoxicillin 500mg - 1 tablet three times daily for 7 days&#10;2. Paracetamol 650mg - as needed for fever"
                                    value={prescription}
                                    onChange={(e) => setPrescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Clinical Notes & Follow-up Instructions</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="e.g. Advised plenty of warm fluids and bed rest. Review after 7 days if symptoms persist."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="modal-footer bg-light">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                                {loading ? "Saving Treatment..." : "Save & Complete Appointment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TreatmentModal;
