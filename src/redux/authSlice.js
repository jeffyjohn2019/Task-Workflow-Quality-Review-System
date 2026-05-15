import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        users: [
            {
                fullName: "admin",
                username: "admin",
                email: "admin@admin.com",
                role: "Admin",
                password: "admin123"
            }
        ],
        loggedInUser: null
    },
    reducers: {
        registerUser: (state, action) => {
            state.users.push(action.payload);
        },
        loginUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        logoutUser: (state) => {
            state.loggedInUser = null;
        },
    },
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;