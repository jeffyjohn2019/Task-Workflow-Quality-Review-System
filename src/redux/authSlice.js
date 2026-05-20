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
            },
            {
                fullName: "John Doe",
                username: "johndoe",
                email: "john@example.com",
                role: "User",
                password: "user123"
            }
        ],
        loggedInUser: null
    },
    reducers: {
        registerUser: (state, action) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action) => {
            const index = state.users.findIndex(u => u.email === action.payload.originalEmail || u.email === action.payload.email);
            if (index !== -1) {
                const { originalEmail, ...updatedUser } = action.payload;
                state.users[index] = updatedUser;
            }
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter(u => u.email !== action.payload);
        },
        loginUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        logoutUser: (state) => {
            state.loggedInUser = null;
        },
    },
});

export const { registerUser, updateUser, deleteUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;