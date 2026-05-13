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

function App() {
   const router = createBrowserRouter([
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
          {path: "dashboard", element: (<Dashboard />)},
          {path: "tasks", element: (<Tasks />)},
          {path: "profile", element: (<Profile />)},
        ]
    },
    {
      path: "/",
      element: (
          <Login />
      ),
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>
}

export default App
