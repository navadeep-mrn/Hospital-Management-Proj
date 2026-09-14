// AUTHENTICATION MIDDLEWARE
// Intercepts protected HTTP requests to verify the JSON Web Token (JWT).
// 1. Reads the "Bearer <token>" header sent by Axios/frontend.
// 2. Decodes the token using our secret key (JWT_SECRET).
// 3. Fetches the corresponding User from MongoDB (without the password).
// 4. Verifies the user account is active.
// 5. Attaches the user object to "req.user" so subsequent controllers know who is making the request.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    // Check if the request contains the Authorization header starting with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract the token part after "Bearer "
            token = req.headers.authorization.split(" ")[1];

            // Verify the signature and expiration of the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user data from database and exclude password field for security
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return res.status(401).json({ message: "User belonging to this token no longer exists" });
            }

            // Check if account has been blocked or deactivated by Admin
            if (!user.isActive) {
                return res.status(403).json({ message: "Your account is deactivated. Please contact hospital admin." });
            }

            // Attach authenticated user to the request object
            req.user = user;
            next();
        } catch (error) {
            console.error("JWT Verification failed:", error.message);
            return res.status(401).json({ message: "Not authorized, invalid or expired token" });
        }
    } else {
        // No token was provided in the headers
        return res.status(401).json({ message: "Not authorized, no authentication token provided" });
    }
};

module.exports = { protect };
