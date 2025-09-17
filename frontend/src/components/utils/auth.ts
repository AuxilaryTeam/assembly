import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "./types";


export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Check if token has expired
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token'); // Optional: auto-clear expired token
            return false;
        }

        return true;
    } catch (error) {
        localStorage.removeItem('token');
        return false;
    }
};
