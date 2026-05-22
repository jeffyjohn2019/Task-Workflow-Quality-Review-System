import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard";
import PrivateRoute from "../src/routes/PrivateRoute";
import PublicRoute from "../src/routes/PublicRoute";
import DashboardLayout from './components/DashboardLayout';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import AdminDashboard from './pages/AdminDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import TaskDetails from './pages/TaskDetails';
import ReviewerDashboard from './pages/ReviewerDashboard';
import ReviewPanel from './pages/ReviewPanel';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Login />
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
      children: [
        { path: "dashboard", element: (<Dashboard />) },
        { path: "tasks", element: (<Tasks />) },
        { path: "users", element: (<Users />) },
        { path: "profile", element: (<Profile />) },
        { path: "admin-dashboard", element: (<AdminDashboard />) },
        { path: "worker-dashboard", element: (<WorkerDashboard />) },
        { path: "task-details/:taskId", element: (<TaskDetails />) },
        { path: "reviewer-dashboard", element: (<ReviewerDashboard />) },
        { path: "review-panel/:taskId", element: (<ReviewPanel />) },
      ]
    },

  ]);

  return <RouterProvider router={router}></RouterProvider>
}

export default App
