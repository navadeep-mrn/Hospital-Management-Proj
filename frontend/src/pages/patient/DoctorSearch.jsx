// DOCTOR SEARCH & DIRECTORY (DoctorSearch.jsx)
// Allows patients to browse hospital physicians, search by name,
// filter by clinical department (e.g. Cardiology, Neurology), and book directly.

import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";

const DoctorSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSpec = searchParams.get("specialization") || "";

    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpec, setSelectedSpec] = useState(initialSpec);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const specRes = await api.get("/specializations");
                setSpecializations(specRes.data);
            } catch (err) {
                console.error("Error loading specializations:", err);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                let url = `/doctors?availableOnly=true&search=${searchTerm}`;
                if (selectedSpec) url += `&specialization=${selectedSpec}`;

                const res = await api.get(url);
                setDoctors(res.data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [searchTerm, selectedSpec]);

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Find a Hospital Specialist</h2>
                        <p className="text-muted mb-0">Discover verified medical practitioners and book consultations</p>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="card hms-card border-0 mb-4 p-3 shadow-sm">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-semibold text-muted">Search by Doctor Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by physician name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-semibold text-muted">Filter by Department</label>
                            <select
                                className="form-select"
                                value={selectedSpec}
                                onChange={(e) => {
                                    setSelectedSpec(e.target.value);
                                    setSearchParams(e.target.value ? { specialization: e.target.value } : {});
                                }}
                            >
                                <option value="">All Medical Specialties</option>
                                {specializations.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedSpec("");
                                    setSearchParams({});
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctor Cards Grid */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Finding specialists...</span>
                        </div>
                    </div>
                ) : doctors.length > 0 ? (
                    <div className="row g-4">
                        {doctors.map((doc) => (
                            <div key={doc._id} className="col-md-6 col-lg-4">
                                <div className="card hms-card border-0 h-100 shadow-sm">
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div>
                                                <h5 className="fw-bold mb-0">{doc.user?.name}</h5>
                                                <span className="badge bg-primary-subtle text-primary">
                                                    {doc.specialization?.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-3 small">
                                            <div className="text-muted mb-1">
                                                <strong>Degrees:</strong> {doc.qualification}
                                            </div>
                                            <div className="text-muted mb-1">
                                                <strong>Experience:</strong> {doc.experience} Years
                                            </div>
                                            <div className="text-muted">
                                                <strong>Office:</strong> {doc.user?.address || "Medical Wing"}
                                            </div>
                                        </div>

                                        <div className="mt-auto d-flex flex-column gap-2">
                                            <Link
                                                to={`/patient/appointments/book?doctor=${doc._id}`}
                                                className="btn btn-primary btn-sm fw-semibold"
                                            >
                                                Book Consultation
                                            </Link>
                                            <Link
                                                to={`/patient/doctors/${doc._id}`}
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                View Schedule & Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card hms-card border-0 p-5 text-center text-muted">
                        No doctors match your criteria. Try adjusting the search filters.
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorSearch;
