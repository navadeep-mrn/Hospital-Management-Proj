// FRONTEND API SERVICE (Axios Instance)
// Configures the base URL pointing to the Express backend server (http://localhost:5000/api).
// An Axios request interceptor automatically attaches the user's JWT token
// stored in localStorage to every outgoing HTTP request under "Authorization: Bearer <token>".

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Intercept every outgoing request and attach token if user is logged in
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("hms_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
