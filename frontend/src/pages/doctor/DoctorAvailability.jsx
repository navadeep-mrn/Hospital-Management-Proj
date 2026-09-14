// ==============================================================================
// DOCTOR AVAILABILITY MANAGER (DoctorAvailability.jsx)
// ==============================================================================
// Simple weekly schedule manager for doctors.
// Allows specifying availability and consultation hours across the 7 days
// (Monday through Sunday) so patients can view valid slots before booking.

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import AlertMessage from "../../components/AlertMessage";

const standardDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorAvailability = () => {
    const [doctorId, setDoctorId] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await api.get("/auth/me");
                if (res.data.profile) {
                    setDoctorId(res.data.profile._id);
                    const existing = res.data.profile.availability || [];

                    // Ensure all 7 days exist in the schedule array
                    const merged = standardDays.map((day) => {
                        const found = existing.find((d) => d.day === day);
                        return (
                            found || {
                                day,
                                isAvailable: day !== "Sunday",
                                slots: day !== "Sunday" ? ["10:00 AM - 01:00 PM", "03:00 PM - 05:00 PM"] : []
                            }
                        );
                    });

                    setSchedule(merged);
                }
            } catch (err) {
                console.error("Error loading availability:", err);
                setFeedback({ type: "danger", message: "Failed to load schedule" });
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, []);

    // Toggle day availability
    const handleToggleDay = (dayIndex) => {
        const updated = [...schedule];
        updated[dayIndex].isAvailable = !updated[dayIndex].isAvailable;
        if (!updated[dayIndex].isAvailable) {
            updated[dayIndex].slots = [];
        } else if (updated[dayIndex].slots.length === 0) {
            updated[dayIndex].slots = ["10:00 AM - 01:00 PM"];
        }
        setSchedule(updated);
    };

    // Add slot to a specific day
    const handleAddSlot = (dayIndex, slotText = "10:00 AM - 01:00 PM") => {
        const updated = [...schedule];
        updated[dayIndex].slots.push(slotText);
        setSchedule(updated);
    };

    // Remove slot from a specific day
    const handleRemoveSlot = (dayIndex, slotIndex) => {
        const updated = [...schedule];
        updated[dayIndex].slots.splice(slotIndex, 1);
        setSchedule(updated);
    };

    // Update slot text
    const handleSlotChange = (dayIndex, slotIndex, value) => {
        const updated = [...schedule];
        updated[dayIndex].slots[slotIndex] = value;
        setSchedule(updated);
    };

    // Save schedule to MongoDB
    const handleSave = async () => {
        if (!doctorId) return;

        try {
            setSaving(true);
            const res = await api.put(`/doctors/${doctorId}/availability`, {
                availability: schedule
            });
            setFeedback({ type: "success", message: res.data.message });
        } catch (err) {
            setFeedback({ type: "danger", message: err.response?.data?.message || "Failed to update schedule" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <main className="dashboard-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1">Weekly Consultation Availability</h2>
                        <p className="text-muted mb-0">Configure your active consultation days and time slots</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving Schedule..." : "Save Schedule"}
                    </button>
                </div>

                <AlertMessage
                    type={feedback.type}
                    message={feedback.message}
                    onClose={() => setFeedback({ type: "", message: "" })}
                />

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading availability...</span>
                        </div>
                    </div>
                ) : (
                    <div className="card hms-card border-0 shadow-sm p-4">
                        <div className="d-flex flex-column gap-3">
                            {schedule.map((daySchedule, dayIndex) => (
                                <div key={daySchedule.day} className="p-3 bg-light rounded-3 border">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="form-check form-switch mb-0">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`switch-${daySchedule.day}`}
                                                    checked={daySchedule.isAvailable}
                                                    onChange={() => handleToggleDay(dayIndex)}
                                                />
                                            </div>
                                            <label
                                                className={`fw-bold mb-0 cursor-pointer ${daySchedule.isAvailable ? "text-primary" : "text-muted"}`}
                                                htmlFor={`switch-${daySchedule.day}`}
                                            >
                                                {daySchedule.day}
                                            </label>
                                            {daySchedule.isAvailable ? (
                                                <span className="badge bg-success-subtle text-success">Available</span>
                                            ) : (
                                                <span className="badge bg-secondary-subtle text-secondary">Unavailable</span>
                                            )}
                                        </div>

                                        {daySchedule.isAvailable && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleAddSlot(dayIndex)}
                                            >
                                                ➕ Add Time Slot
                                            </button>
                                        )}
                                    </div>

                                    {daySchedule.isAvailable && (
                                        <div className="ms-md-5 mt-2">
                                            {daySchedule.slots && daySchedule.slots.length > 0 ? (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {daySchedule.slots.map((slot, slotIndex) => (
                                                        <div key={slotIndex} className="input-group input-group-sm" style={{ width: "260px" }}>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={slot}
                                                                onChange={(e) => handleSlotChange(dayIndex, slotIndex, e.target.value)}
                                                                placeholder="e.g. 10:00 AM - 01:00 PM"
                                                            />
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                type="button"
                                                                onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                                                                title="Remove Slot"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <small className="text-warning">
                                                    No slots configured. Click "Add Time Slot" above.
                                                </small>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button className="btn btn-primary px-4" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving Schedule..." : "Save Availability"}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorAvailability;
