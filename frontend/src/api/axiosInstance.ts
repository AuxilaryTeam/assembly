import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/";

const instance = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default instance;
