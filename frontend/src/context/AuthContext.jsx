// AUTHENTICATION CONTEXT (AuthContext)
// Provides global authentication state throughout the React component tree
// using React's built-in Context API (avoiding heavy third-party libraries like Redux).
//
// Key responsibilities:
// 1. Tracks the currently logged-in user, token, and user role.
// 2. Persists login session in localStorage across browser reloads.
// 3. Exposes login, register, and logout functions to any component.

import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check localStorage on application startup
    useEffect(() => {
        const savedToken = localStorage.getItem("hms_token");
        const savedUser = localStorage.getItem("hms_user");

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (err) {
                console.error("Error restoring session:", err);
                localStorage.removeItem("hms_token");
                localStorage.removeItem("hms_user");
            }
        }
        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        const { token: receivedToken, user: receivedUser } = res.data;

        // Save to state
        setToken(receivedToken);
        setUser(receivedUser);

        // Save to localStorage for persistence
        localStorage.setItem("hms_token", receivedToken);
        localStorage.setItem("hms_user", JSON.stringify(receivedUser));

        return receivedUser;
    };

    // Register function (Patients)
    const register = async (formData) => {
        const res = await api.post("/auth/register", formData);
        const { token: receivedToken, user: receivedUser } = res.data;

        setToken(receivedToken);
        setUser(receivedUser);

        localStorage.setItem("hms_token", receivedToken);
        localStorage.setItem("hms_user", JSON.stringify(receivedUser));

        return receivedUser;
    };

    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("hms_token");
        localStorage.removeItem("hms_user");
    };

    // Update local user state (e.g. after profile edit)
    const updateUser = (updatedUser) => {
        const merged = { ...user, ...updatedUser };
        setUser(merged);
        localStorage.setItem("hms_user", JSON.stringify(merged));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                role: user ? user.role : null,
                loading,
                login,
                register,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for convenient consumption in components
export const useAuth = () => useContext(AuthContext);
