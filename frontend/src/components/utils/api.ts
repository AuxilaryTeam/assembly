import axios from "axios";
import type { LoginRequest, SignUpRequest, Customer, ImportRequest, RetentionRequestDTO } from "./types";

const BASE_URL = "http://localhost:8081/api"
// const BASE_URL = "http://localhost:8085/import_export_be/api"
// const BASE_URL = "http://inhouseapps.bankofabyssinia.com:8085/import_export_be/api"
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
    return api.post("/user/register", userData);
}

export const userLogin = (userData: LoginRequest) => {
    return api.post("/user/login", userData);
}

export const createCustomer = (customer: object) => {
    return api.post("/customer/create", customer)
}

export const searchCustomers = (query: string) => {
    return api.get(`/customer/search?query=${encodeURIComponent(query)}`);
}

export const getCustomerById = (customerId: number) => {
    return api.get<Customer>(`/customer/${customerId}`);
}


// retention 



export const getRetentionData = (customerId: number) => {
    return api.get(`/retention/${customerId}`);
}

export const createRetention = (request: any) => {
    return api.post('/retention/create', request);
}

export const createWithOutWeeklyRetention = (request: any, reference: string) => {
    return api.post(`/retention/create/${reference}`, request);
}

export const updateRetentionData = (retentionId: number, data: object) => {
    return api.post(`/retention/update/${retentionId}`, data)
}

export const getRetentionbyId = (retentionId: number) => {
    return api.get(`/retention/find/${retentionId}`);
}

export const approveRententionRequest = (retentionId: number, status: { status: string; }) => {
    return api.post(`/retention/approve/${retentionId}`, status);
}

export const reportByCommodity = (startDate: string, endDate: string) => {
    return api.get(`/retention/reportByCommodity?startDate=${startDate}&endDate=${endDate}`);
}


export const reportByCustomer = (startDate: string, endDate: string) => {
    return api.get(`/retention/reportByCustomer?startDate=${startDate}&endDate=${endDate}`);
}




export const getImportRequests = (customerId: number) => {
    return api.get(`/import/${customerId}`);
}

export const getImportbyId = (importId: number) => {
    return api.get(`/import/find/${importId}`)
}

export const updateImportRequest = (importRequestId: number, data: object) => {
    return api.post(`/import/update/${importRequestId}`, data)
}

export const approveImportRequest = (importId: number, status: { status: string; }) => {
    return api.post(`/import/approve/${importId}`, status);
}



export const createImportRequest = (request: ImportRequest[]) => {
    console.log("Creating import request", request);
    return api.post("import/create", request)
}

export const uploadWeeklyReport = (file: File) => {
    console.log("File is present", !file)
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/excel/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const onBoardWeekly = (id: number, data: object) => {
    return api.post(`/weekly-reports/onboard/${id}`, data);
}

export const onBoardWeeklyBulk = (request: { retention: RetentionRequestDTO; weeklyReportIds: number[]; }) => {
    return api.post("/retention/bulk", request);
}

export const getPendingRequests = () => {
    return api.get("/requests/pending_request")
}

export const getApprovedRequests = () => {
    return api.get("/requests/approved_request")
}


export const getAllWeeklyReports = () => {
    return api.get("/weekly-reports")
}

export const getPendingWeekly = () => {
    return api.get("/weekly-reports/pending")
}