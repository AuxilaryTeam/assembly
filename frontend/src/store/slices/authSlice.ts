import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState, DecodedToken } from '../../components/utils/types';
import { jwtDecode } from "jwt-decode";

let token = localStorage.getItem('token');
let decodedUser: DecodedToken | null = null;

if (token) {
    try {
        decodedUser = jwtDecode(token);
    } catch (e) {
        token = null; // Invalid token
    }
}


const initialState: AuthState = {
    user: decodedUser ? {
        id: decodedUser.userId,
        firstName: decodedUser.firstName,
        email: decodedUser.sub,
        roleId: decodedUser.roleId,
        roleName: decodedUser.roleName,
    } : null,
    token: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
        },

    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;