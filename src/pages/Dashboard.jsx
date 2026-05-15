import React from "react";
import { useSelector } from "react-redux";
import { FaHome, FaBuilding, FaUsers, FaUserFriends, FaChartPie } from "react-icons/fa";
import DashboardCharts from "../components/DashboardCharts";

function Dashboard() {
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);

  return (
    <div className="space-y-6">
      {/* 5 columns grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-[#1a2b4c] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold mt-1">12</p>
          </div>
          <FaHome className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        <div className="p-5 bg-[#757575] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">Pending Tasks</h3>
            <p className="text-3xl font-bold mt-1">4</p>
          </div>
          <FaBuilding className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        <div className="p-5 bg-[#FF9800] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">In Review</h3>
            <p className="text-3xl font-bold mt-1">2</p>
          </div>
          <FaBuilding className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>


        <div className="p-5 bg-[#4CAF50] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">Completed Tasks</h3>
            <p className="text-3xl font-bold mt-1">6</p>
          </div>
          <FaUsers className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>

        <div className="p-5 bg-[#e31a4c] rounded-xl shadow-md text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xs font-semibold opacity-90 tracking-wider mb-2">Blocked Tasks</h3>
            <p className="text-3xl font-bold mt-1">0</p>
          </div>
          <FaUserFriends className="text-5xl opacity-30 absolute right-4 z-0" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>
      </div>

      {/* Charts Row */}
      <DashboardCharts />
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col min-h-[350px]">
          <h3 className="text-center text-sm font-bold text-gray-700 mb-8">Monthly Report</h3>
          <div className="flex-1 flex items-end justify-center space-x-2 border-b border-gray-200 pb-2 relative">
            <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between">
              {[1, 0.75, 0.5, 0.25, 0].map(val => (
                <div key={val} className="w-full flex items-center h-0.5">
                  <span className="text-[10px] text-gray-400 w-8">{val}</span>
                  <div className="flex-1 border-t border-dashed border-gray-100"></div>
                </div>
              ))}
            </div>
            <div className="w-8 h-[90%] bg-red-600 rounded-t-sm z-10 transition-all shadow-md mt-6"></div>
            <div className="w-8 h-[90%] bg-green-500 rounded-t-sm z-10 transition-all shadow-md mt-6"></div>
          </div>
          <div className="w-full mt-4 flex justify-between px-10 text-[10px] text-gray-500 overflow-hidden font-medium">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
          <div className="mt-6 flex justify-center space-x-4 text-[10px]">
            <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-600 mr-2"></div><span className="text-red-600 font-bold tracking-wide">Project 1</span></div>
            <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div><span className="text-green-500 font-bold tracking-wide">Project 2</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[350px]">
          <h3 className="text-sm font-bold text-gray-700 mb-12 flex items-center justify-start w-full"><FaChartPie className="text-[#1a2b4c] mr-2" /> Projects Status Report</h3>

          <div className="w-48 h-48 rounded-full bg-blue-600 relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: "conic-gradient(#e31a4c 35%, #3b82f6 0)" }}>
            <div className="w-[188px] h-[188px] rounded-full border-2 border-white absolute"></div>
          </div>
          <div className="mt-6 flex justify-between w-full px-4 text-xs font-semibold">
            <span className="text-blue-600">Project 1</span>
            <span className="text-red-500">Project 2</span>
          </div>
        </div>
      </div> */}

      {/* Donut Row */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[250px]">
          <h3 className="text-sm font-bold text-gray-700 mb-6 flex justify-start w-full tracking-wide"><FaCheckCircle className="text-orange-500 mr-2" /> Projects: Submitted vs Accepted by ULB</h3>
          <div className="w-40 h-40 rounded-full border-[20px] border-green-500 flex flex-col items-center justify-center relative mt-4 shadow-inner">
            <div className="absolute inset-0 border-[20px] border-orange-500 rounded-full shadow-inner" style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)", margin: "-20px" }}></div>
            <span className="text-3xl font-bold text-orange-500 mt-3 pt-2">2</span>
            <span className="text-[11px] text-gray-500 font-medium">Total Submitted</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col items-center min-h-[250px] relative">
          <h3 className="text-sm font-bold text-gray-700 mb-6 flex justify-start w-full tracking-wide"><FaCheckCircle className="text-green-500 mr-2" /> Accepted vs Completed Projects</h3>
          <div className="w-40 h-40 rounded-full border-[20px] border-blue-500 flex flex-col items-center justify-center relative mt-4 shadow-inner">
            <span className="text-3xl font-bold text-blue-500 mt-3 pt-2">0</span>
            <span className="text-[11px] text-gray-500 font-medium">Completed</span>
          </div>
        </div> 
      </div> */}

    </div>
  );
}

export default Dashboard;