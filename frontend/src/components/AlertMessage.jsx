// ==============================================================================
// ALERT MESSAGE COMPONENT
// ==============================================================================
// Dismissible feedback banner for operations (e.g. success notification,
// slot double-booking error, or validation failure).

import React from "react";

const AlertMessage = ({ type = "info", message, onClose }) => {
    if (!message) return null;

    return (
        <div className={`alert alert-${type} alert-dismissible fade show d-flex align-items-center justify-content-between shadow-sm`} role="alert">
            <div>{message}</div>
            {onClose && (
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                ></button>
            )}
        </div>
    );
};

export default AlertMessage;
