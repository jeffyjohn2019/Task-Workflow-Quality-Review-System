import React from "react";
import { useSelector } from "react-redux";

function Dashboard() {
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">
        Welcome {loggedInUser?.fullName || "User"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-blue-50 rounded-xl border">
          <h3 className="text-lg font-semibold text-blue-700">Total Tasks</h3>
          <p className="text-2xl font-bold mt-2 text-gray-800">12</p>
        </div>

        <div className="p-4 bg-green-50 rounded-xl border">
          <h3 className="text-lg font-semibold text-green-700">Completed</h3>
          <p className="text-2xl font-bold mt-2 text-gray-800">7</p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-xl border">
          <h3 className="text-lg font-semibold text-yellow-700">Pending</h3>
          <p className="text-2xl font-bold mt-2 text-gray-800">5</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;