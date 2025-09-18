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

export type IssueRequest = {
    id: number;
    title: string;
    description: string;
};

export type IssueItem = {
    id: number;
    title: string;
    description: string;
    status: string;
    active: boolean;

}