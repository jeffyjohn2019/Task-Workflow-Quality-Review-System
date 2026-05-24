import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaTasks, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminTaskReviews() {
    const tasks = useSelector((state) => state.tasks.tasks);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    // filter for tasks that have feedback (which means they were approved or rejected)
    // or tasks that are currently "In Review" or "Reviewed".
    const reviewedTasks = tasks.filter(t => t.reviewFeedback || t.status === "Reviewed" || t.status === "In Review");

    const filteredTasks = reviewedTasks.filter(task =>
        task.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1a2b4c]">Task Reviews</h2>
                <div className="relative w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a2b4c] focus:ring-1 focus:ring-[#1a2b4c]/20"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Task</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Assignee</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Reviewer</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Review Reason Details</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider w-24 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((task) => (
                                <tr key={task.id} className="border-b border-gray-50 hover:bg-[#f8f9ff] transition duration-150">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">{task.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">#{task.id.toString().slice(-4)}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{task.assignee || "—"}</td>
                                    <td className="px-6 py-4 text-gray-600">{task.reviewer || "—"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${task.status === "Reviewed" ? "bg-teal-500/10 text-teal-600 border-teal-500/20" : task.status === "In Review" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : task.status === "Rejected" ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}>
                                            {task.status || "—"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-md">
                                        <p className="text-gray-700 italic text-sm line-clamp-2">
                                            {task.reviewFeedback || "No feedback provided yet."}
                                        </p>
                                        {task.reviewChecklist && task.reviewChecklist.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {task.reviewChecklist.map((item, idx) => (
                                                    <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => navigate(`/task-details/${task.id}`)}
                                            className="text-[#0b64a3] hover:text-[#094d7d] font-semibold text-xs tracking-wide bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition"
                                        >
                                            VIEW
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <FaTasks className="mx-auto mb-3 text-3xl opacity-30" />
                                        <p>No reviewed tasks found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminTaskReviews;
