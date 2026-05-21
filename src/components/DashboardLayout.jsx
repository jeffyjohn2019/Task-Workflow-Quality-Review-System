import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

function DashboardLayout() {
  const navigate = useNavigate();
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium transition ${isActive ? "bg-[#263f6e] text-white" : "text-gray-200 hover:bg-[#0f192d]"
    }`;

  const role = loggedInUser?.role;

  const getNavLinks = () => {
    switch (role) {
      case "Admin":
        return (
          <>
            <NavLink to="/admin-dashboard" className={menuClass}>Admin Panel</NavLink>
            <NavLink to="/tasks" className={menuClass}>Tasks</NavLink>
            <NavLink to="/users" className={menuClass}>Users</NavLink>
            <NavLink to="/profile" className={menuClass}>Profile</NavLink>
            <NavLink to="/dashboard" className={menuClass}>Reports</NavLink>
          </>
        );
      case "Worker":
        return (
          <>
            <NavLink to="/worker-dashboard" className={menuClass}>My Tasks</NavLink>
            <NavLink to="/profile" className={menuClass}>Profile</NavLink>
          </>
        );
      case "Reviewer":
        return (
          <>
            <NavLink to="/reviewer-dashboard" className={menuClass}>Reviews</NavLink>
            <NavLink to="/profile" className={menuClass}>Profile</NavLink>
          </>
        );
      default:
        return (
          <>
            <NavLink to="/dashboard" className={menuClass}>Dashboard</NavLink>
            <NavLink to="/tasks" className={menuClass}>Tasks</NavLink>
            <NavLink to="/users" className={menuClass}>Users</NavLink>
            <NavLink to="/profile" className={menuClass}>Profile</NavLink>
          </>
        );
    }
  };

  const roleBadge = role ? (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${role === "Admin" ? "bg-amber-500/20 text-amber-300" :
      role === "Worker" ? "bg-blue-500/20 text-blue-300" :
        role === "Reviewer" ? "bg-purple-500/20 text-purple-300" :
          "bg-gray-500/20 text-gray-300"
      }`}>
      {role}
    </span>
  ) : null;

  return (
    <div className="min-h-screen flex bg-[#f4f2f5]">
      {/* Sidebar */}
      <aside className="w-44 bg-[#1a2b4c] shadow-lg hidden md:block text-white z-20">
        <div className="p-2 border-b border-[#263f6e] flex items-center justify-center bg-white m-4 rounded-lg shadow">
          <img src="./src/assets/WorkFlowLogo.png" alt="Workflow Logo" className="h-20 w-25 object-contain" />
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {getNavLinks()}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-[#1a2b4c] shadow-md flex justify-end items-center px-6 border-b border-[#263f6e] z-10">
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center space-x-3 bg-[#0f192d] px-4 py-1.5 rounded-full shadow-inner border border-[#263f6e]">
              <FaUserCircle className="text-2xl text-cyan-200" />
              <span className="font-semibold tracking-wide text-sm">{loggedInUser?.fullName || "admin"}</span>
              {roleBadge}
            </div>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="bg-red-500 text-white px-5 py-1.5 rounded-full hover:bg-red-600 transition shadow tracking-wider font-semibold text-sm border border-red-400"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        message="Are you sure you want to logout?"
      />
    </div>
  );
}

export default DashboardLayout;