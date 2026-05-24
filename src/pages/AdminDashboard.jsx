import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTasks, FaHourglassHalf, FaSearch, FaClipboardCheck, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function AdminDashboard() {
    const tasks = useSelector((state) => state.tasks.tasks);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredTasks = tasks.filter((task) => {
        const matchSearch = task.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter ? task.status === statusFilter : true;
        return matchSearch && matchStatus;
    });

    const totalTasks = filteredTasks.length;
    const pendingTasks = filteredTasks.filter(t => t.status === "New" || t.status === "In Progress").length;
    const inReviewTasks = filteredTasks.filter(t => t.status === "In Review").length;
    const completedTasks = filteredTasks.filter(t => t.status === "Completed" || t.status === "Reviewed").length;
    const rejectedTasks = filteredTasks.filter(t => t.status === "Rejected").length;
    const blockedTasks = filteredTasks.filter(t => t.priority === "High" && t.status !== "Completed" && t.status !== "Reviewed").length;

    // Metric Calculations
    const reviewedCount = completedTasks + rejectedTasks;
    const accuracy = reviewedCount > 0 ? Math.round((completedTasks / reviewedCount) * 100) : 0;
    const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const priorityBadge = (priority) => {
        const styles = {
            High: "bg-red-500/10 text-red-400 border-red-500/20",
            Normal: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            Low: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        };
        return styles[priority] || styles.Normal;
    };

    const statusBadge = (status) => {
        const styles = {
            New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            "In Progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
            "In Review": "bg-purple-500/10 text-purple-400 border-purple-500/20",
            Reviewed: "bg-teal-500/10 text-teal-400 border-teal-500/20",
            Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
        };
        return styles[status] || styles.New;
    };

    const statCards = [
        { label: "Total Tasks", value: totalTasks, icon: FaTasks, bg: "from-[#1a2b4c] to-[#2a4a7f]" },
        { label: "Pending", value: pendingTasks, icon: FaHourglassHalf, bg: "from-[#757575] to-[#9e9e9e]" },
        { label: "In Review", value: inReviewTasks, icon: FaClipboardCheck, bg: "from-[#FF9800] to-[#FFB74D]" },
        { label: "Completed", value: completedTasks, icon: FaCheckCircle, bg: "from-[#4CAF50] to-[#81C784]" },
        { label: "Accuracy", value: `${accuracy}%`, icon: FaClipboardCheck, bg: "from-[#3F51B5] to-[#7986CB]" },
        { label: "Productivity", value: `${productivity}%`, icon: FaHourglassHalf, bg: "from-[#009688] to-[#4DB6AC]" },
        { label: "Blocked", value: blockedTasks, icon: FaExclamationTriangle, bg: "from-[#e31a4c] to-[#ef5350]" },
    ];

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className={`bg-gradient-to-br ${card.bg} rounded-2xl p-5 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group`}
                    >
                        <div className="relative z-10">
                            <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">{card.label}</p>
                            <p className="text-3xl font-bold">{card.value}</p>
                        </div>
                        <card.icon className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                        <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Search + Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search tasks by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a2b4c] focus:ring-1 focus:ring-[#1a2b4c]/20 transition-all bg-gray-50/50"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-[#1a2b4c] bg-gray-50/50 min-w-[160px]"
                    >
                        <option value="">All Statuses</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="In Review">In Review</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h3 className="font-semibold text-gray-800">All Tasks <span className="text-gray-400 font-normal text-sm">({filteredTasks.length})</span></h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-3.5 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3.5 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Task Name</th>
                                <th className="px-6 py-3.5 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Assignee</th>
                                <th className="px-6 py-3.5 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Reviewer</th>
                                <th className="px-6 py-3.5 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3.5 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3.5 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Deadline</th>
                                <th className="px-6 py-3.5 font-semibold text-[#1a2b4c] text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map((task) => (
                                <tr
                                    key={task.id}
                                    className="border-b border-gray-50 hover:bg-[#f8f9ff] transition-colors duration-150 cursor-pointer"
                                >
                                    <td className="px-6 py-4 text-xs font-mono text-gray-400">#{task.id.toString().slice(-4)}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{task.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{task.assignee || "—"}</td>
                                    <td className="px-6 py-4 text-gray-600">{task.reviewer || "—"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${priorityBadge(task.priority)}`}>
                                            {task.priority || "Normal"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${statusBadge(task.status)}`}>
                                            {task.status || "New"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">{task.endDate || "—"}</td>
                                    <td className="px-6 py-4 text-center">
                                        {task.status === 'Reviewed' &&
                                            <button
                                                onClick={() => navigate(`/task-details/${task.id}`)}
                                                className="text-[#0b64a3] hover:text-[#094d7d] font-semibold text-xs tracking-wide bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition"
                                            >
                                                VIEW
                                            </button>
                                        }

                                    </td>
                                </tr>
                            ))}
                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        <FaTasks className="mx-auto mb-2 text-2xl opacity-40" />
                                        No tasks found matching your filters.
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

export default AdminDashboard;
