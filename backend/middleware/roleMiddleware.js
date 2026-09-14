// ROLE AUTHORIZATION MIDDLEWARE
// Enforces Role-Based Access Control (RBAC).
// Ensures that only specific user roles (e.g. "admin", "doctor", "patient") can access
// protected API endpoints.
// Example: authorize("admin") will reject doctors and patients with HTTP 403 Forbidden.

const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user was attached previously by the "protect" authentication middleware
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied: Role '${req.user ? req.user.role : "Unknown"}' is not authorized to access this resource`
            });
        }
        // User has an approved role; proceed to the controller
        next();
    };
};

module.exports = { authorize };
