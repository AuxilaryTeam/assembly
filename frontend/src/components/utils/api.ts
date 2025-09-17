import axios from "axios";
import type { LoginRequest, SignUpRequest, Customer, ImportRequest, RetentionRequestDTO } from "./types";

const BASE_URL = "http://localhost:8081/api"

// Axios instance for API requests
const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const userSignUp = (userData: SignUpRequest) => {
    return api.post("/auth/register", userData);
}

export const userLogin = (userData: LoginRequest) => {
    return api.post("/auth/login", userData);
}
