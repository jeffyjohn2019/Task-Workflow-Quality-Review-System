import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
    name: "tasks",
    initialState: {
        tasks: [
            {
                id: "1001",
                name: "Set up Task Quality Review workflow",
                description: "Initial task to configure review gates, thresholds, and role assignments for the QA board.",
                assignee: "John Doe",
                priority: "High",
                estimatedTime: "8",
                startDate: "2026-05-20",
                endDate: "2026-05-27",
                progress: 20,
                status: "New",
                attachments: []
            }
        ]
    },
    reducers: {
        addTask: (state, action) => {
            state.tasks.push({
                id: Date.now().toString(),
                status: "New",
                ...action.payload
            });
        },
        updateTask: (state, action) => {
            const index = state.tasks.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(t => t.id !== action.payload);
        },
    },
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
