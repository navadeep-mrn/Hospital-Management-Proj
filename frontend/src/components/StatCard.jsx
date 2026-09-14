// ==============================================================================
// STAT CARD COMPONENT
// ==============================================================================
// Clean metric card used across Admin, Doctor, and Patient dashboards.
// Styled strictly with shades of blue, grey, black, and white.

import React from "react";

const StatCard = ({ title, value, icon, variant = "blue" }) => {
    // Dynamic styling restricted to blue, black, and grey shades
    const isDark = variant === "dark" || variant === "secondary";
    const iconBgClass = isDark ? "bg-light text-dark border" : "bg-primary-subtle text-primary border border-primary-subtle";

    return (
        <div className="card hms-card h-100 border shadow-sm">
            <div className="card-body d-flex align-items-center gap-3 p-3">
                {icon && (
                    <div
                        className={`stat-icon-wrapper ${iconBgClass} fs-3 rounded-3 d-flex align-items-center justify-content-center`}
                        style={{ width: "52px", height: "52px" }}
                    >
                        {icon}
                    </div>
                )}
                <div>
                    <h6 className="card-subtitle text-muted mb-1" style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        {title}
                    </h6>
                    <h3 className="card-title fw-bold mb-0 text-dark">
                        {value !== undefined ? value : "--"}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
