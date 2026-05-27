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
                reviewer: "Alex Reviewer",
                priority: "High",
                estimatedTime: "8",
                startDate: "2026-05-20",
                endDate: "2026-05-26",
                progress: 20,
                status: "New",
                attachments: [],
                submission: "",
                reviewFeedback: "",
                reviewChecklist: []
            },
            {
                id: "1002",
                name: "Design dashboard wireframes",
                description: "Create wireframes for admin, worker and reviewer dashboards with modern card-based layouts.",
                assignee: "Jeffy",
                reviewer: "Albin Reviewer",
                priority: "Normal",
                estimatedTime: "5",
                startDate: "2026-05-18",
                endDate: "2026-05-22",
                progress: 80,
                status: "In Progress",
                attachments: [],
                submission: "",
                reviewFeedback: "",
                reviewChecklist: []
            },
            {
                id: "1003",
                name: "Implement API endpoints",
                description: "Build RESTful API endpoints for task CRUD operations, user authentication, and review submissions.",
                assignee: "Jane Smith",
                reviewer: "Albin Reviewer",
                priority: "High",
                estimatedTime: "12",
                startDate: "2026-05-19",
                endDate: "2026-05-28",
                progress: 100,
                status: "In Review",
                attachments: [],
                submission: "All API endpoints have been implemented and tested. Includes GET/POST/PUT/DELETE for tasks, JWT-based auth, and review submission endpoints. Unit tests pass at 94% coverage.",
                reviewFeedback: "",
                reviewChecklist: []
            },
            {
                id: "1004",
                name: "Write unit tests for auth module",
                description: "Complete unit test coverage for the authentication module including login, register, and token validation.",
                assignee: "Jane Smith",
                reviewer: "Alex Reviewer",
                priority: "Low",
                estimatedTime: "4",
                startDate: "2026-05-15",
                endDate: "2026-05-18",
                progress: 100,
                status: "Reviewed",
                attachments: [],
                submission: "All 24 unit tests passing. Covers login, registration, token refresh, and edge cases.",
                reviewFeedback: "Excellent coverage. All edge cases handled properly.",
                reviewChecklist: ["Code Quality", "Requirements Met", "Test Coverage"]
            },
            {
                id: "1005",
                name: "Database schema optimization",
                description: "Optimize database queries and add proper indexing for the tasks and reviews collections.",
                assignee: "Jeffy",
                reviewer: "Alex Reviewer",
                priority: "Normal",
                estimatedTime: "6",
                startDate: "2026-05-21",
                endDate: "2026-05-25",
                progress: 100,
                status: "In Review",
                attachments: [],
                submission: "Added compound indexes on tasks collection. Query times improved by 60%. Migration script included.",
                reviewFeedback: "",
                reviewChecklist: []
            }
        ]
    },
    reducers: {
        addTask: (state, action) => {
            state.tasks.push({
                id: Date.now().toString(),
                status: "New",
                submission: "",
                reviewFeedback: "",
                reviewChecklist: [],
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
        submitTask: (state, action) => {
            const index = state.tasks.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index].submission = action.payload.submission;
                state.tasks[index].status = "In Review";
                state.tasks[index].progress = 100;

                if (state.tasks[index].endDate) {
                    const endDate = new Date(state.tasks[index].endDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (today > endDate) {
                        state.tasks[index].isLateSubmission = true;
                    }
                }
            }
        },
        reviewTask: (state, action) => {
            const { id, approved, feedback, checklist } = action.payload;
            const index = state.tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                state.tasks[index].reviewFeedback = feedback;
                state.tasks[index].reviewChecklist = checklist;
                state.tasks[index].status = approved ? "Reviewed" : "Rejected";
                if (!approved) {
                    state.tasks[index].progress = 50;
                    state.tasks[index].submission = "";
                }
            }
        }
    },
});

export const { addTask, updateTask, deleteTask, submitTask, reviewTask } = tasksSlice.actions;
export default tasksSlice.reducer;
