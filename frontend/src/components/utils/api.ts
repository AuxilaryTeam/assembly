import axios from "axios";
import type { LoginRequest, SignUpRequest, IssueRequest, VoterItem, VoteRequest } from "./types";

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



//  ========== Issue ===============
export const createIssue = (newIssue: IssueRequest) => {
    return api.post("/issue/createIssue", newIssue);
}

export const updateIssue = (id: number, updatedIssue: IssueRequest) => {
    return api.put(`/issue/updateIssue/${id}`, updatedIssue)
}

export const getIssueList = () => {
    return api.get("/issue/active");
}

export const activateIssue = (id: number) => {
    return api.put(`/issue/active/${id}`)
}

export const closeIssue = (id: number) => {
    return api.put(`/issue/close/${id}`)
}

export const getIssue = (id: number) => {
    return api.get(`/issue/getIssue/${id}`);
}

export const getIssueResult = (id: number) => {
    return api.get(`/issue/result/${id}`);
}

export const voteIssue = (vote: VoteRequest) => {
    return api.post("/issue/vote", vote)
}



//  ============= voter =============

export const getVoters = () => {
    return api.get("/voter");
}

export const getVoterById = (value: string) => {
    return api.get(`/voter/${value}`);
}

export const registerVoter = (data: VoterItem) => {
    return api.post("/voter/register", data);
}
