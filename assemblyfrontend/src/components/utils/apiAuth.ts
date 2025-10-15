// src/utils/apiAuth.ts
import axios from "axios";

export const BASE_AUTH_URL =
  import.meta.env.VITE_API_BASE_URL + "auth" ||
  "http://localhost:8082/assemblyservice/api/auth";

const authApi = axios.create({
  baseURL: BASE_AUTH_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export const loginUser = (loginData: {
  username: string;
  password: string;
}) => {
  return authApi.post("/login", loginData);
};

export const registerUser = (userData: any) => {
  return authApi.post("/register", userData);
};
