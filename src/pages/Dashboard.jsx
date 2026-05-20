import React from "react";
import { useSelector } from "react-redux";
import { FaHome, FaBuilding, FaUsers, FaUserFriends, FaChartPie } from "react-icons/fa";
import DashboardCharts from "../components/DashboardCharts";

function Dashboard() {
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);
  const tasks = useSelector((state) => state.tasks.tasks);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === "In Progress" || t.status === "New").length;
  const inReviewTasks = tasks.filter(t => t.status === "In Review").length;
  const completedTasks = tasks.filter(t => t.status === "Completed" || t.status === "Reviewed").length;
  const blockedTasks = tasks.filter(t => t.priority === "High" && t.status !== "Completed" && t.status !== "Reviewed").length;

  return (
    <div className="space-y-6">
      {/* 5 columns grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-[#1a2b4c] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold mt-1">{totalTasks}</p>
          </div>
          <FaHome className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        <div className="p-5 bg-[#757575] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">Pending Tasks</h3>
            <p className="text-3xl font-bold mt-1">{pendingTasks}</p>
          </div>
          <FaBuilding className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        <div className="p-5 bg-[#FF9800] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">In Review</h3>
            <p className="text-3xl font-bold mt-1">{inReviewTasks}</p>
          </div>
          <FaBuilding className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>


        <div className="p-5 bg-[#4CAF50] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">Completed Tasks</h3>
            <p className="text-3xl font-bold mt-1">{completedTasks}</p>
          </div>
          <FaUsers className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        <div className="p-5 bg-[#e31a4c] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">Blocked Tasks</h3>
            <p className="text-3xl font-bold mt-1">{blockedTasks}</p>
          </div>
          <FaUserFriends className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>
      </div>

      {/* Charts Row */}
      <DashboardCharts />


    </div>
  );
}

export default Dashboard;