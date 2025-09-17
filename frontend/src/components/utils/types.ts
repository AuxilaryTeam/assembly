// User and Auth Types

export interface DecodedToken {
    sub: string; // subject (user ID)
    userId: number; // optional fields
    roleId: number;
    roleName: string;
    exp: number;
    iat: number;
    [key: string]: any; // allow other props too
}


export interface DecodedUser {
    id: number;
    firstName: string;
    email: string;
    roleId: number;
    roleName: string;
}

export interface User {
    id: number;
    firstName: string;
    email: string;
    roleId: number;
    roleName: string;
}

export interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    token: string | null;
}


// User authentication types
export interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}




export interface SignUpForm {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    roleId: number;
}

export interface SignUpRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    roleId: number


}



// Retention types
export interface RetentionData {
    Currency: string;
    "Monthly Proceed": number;
    "To Retention Account": number;
    "To Customer Account": number;
    "Surrender Amount": number;
    "Outflow from Retention": number;
    "Inflow to Retention": number;
}


export interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
    formatNumber?: boolean;
    type?: "text" | "number" | "date";
    render?: (row: any, rowIdx?: number) => React.ReactNode;
}

export interface SortTableProps {
    columns: Column[];
    data: any[];
    defaultSortKey?: string;
    numericColumns?: boolean;
    enableAddRowForm?: boolean;
    onSaveRow?: (row: any) => void;
}


export interface Customer {
    customerId: number;
    customerName: string;
    netBalance: number;
    t24Id: number;
}


export interface ImportRequest {
    currency: string;
    importRequestAmount: string;
    importDetail: string;
    importType: string;
    importData: string;
    customerId: number;
}

export interface RetentionRequest {
    currency: string;
    retentionAmount: number;
    creditAmount: number;
    surrenderedAmount: number;
    outflowAmount: number;
    inflowAmount: number;
    customer: number; // customer ID
    weeklyReport: number;
}

export interface OptionsType {
    value: string;
    label: string;
}

export interface weeklyReport {
    currency: string;
    customerId: number;
    customerName: string;
    date: string;
    monthlyProceedAmount: number;
    netBalance: number;
    status: string;
    weeklyReportId: number;
}


export interface RetentionRequestDTO {
    customer: number;
    currency: string;
    creditAmount: number;
    retentionAmount: number;
    surrenderedAmount: number;
    inflowAmount: number;
    outflowAmount: number;
}