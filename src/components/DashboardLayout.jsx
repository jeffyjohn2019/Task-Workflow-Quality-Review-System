import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function DashboardLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");

    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium transition ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 text-xl font-bold text-blue-600 border-b">
          Task Workflow
        </div>

        <nav className="p-4 space-y-2">
          <NavLink to="/dashboard" className={menuClass}>
            Dashboard
          </NavLink>

          <NavLink to="/tasks" className={menuClass}>
            Tasks
          </NavLink>

          <NavLink to="/profile" className={menuClass}>
            Profile
          </NavLink>

        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex justify-between items-center px-6">
         

          <button
            onClick={logout}
            className="bg-red-600  text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;