import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaClock, FaFlag, FaCalendarAlt, FaArrowRight, FaClipboardList } from "react-icons/fa";

function WorkerDashboard() {
    const loggedInUser = useSelector((state) => state.auth.loggedInUser);
    const tasks = useSelector((state) => state.tasks.tasks);
    const navigate = useNavigate();

    const myTasks = tasks.filter(
        (t) => t.assignee === loggedInUser?.fullName
    );

    const priorityColor = (p) => ({
        High: { badge: "bg-red-500/10 text-red-400 border-red-500/20", bar: "bg-red-500" },
        Normal: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", bar: "bg-emerald-500" },
        Low: { badge: "bg-sky-500/10 text-sky-400 border-sky-500/20", bar: "bg-sky-500" },
    }[p] || { badge: "bg-gray-500/10 text-gray-400 border-gray-500/20", bar: "bg-gray-500" });

    const statusColor = (s) => ({
        New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "In Progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
        "In Review": "bg-purple-500/10 text-purple-400 border-purple-500/20",
        Reviewed: "bg-teal-500/10 text-teal-400 border-teal-500/20",
        Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    }[s] || "bg-gray-500/10 text-gray-400 border-gray-500/20");

    const summary = {
        total: myTasks.length,
        inProgress: myTasks.filter(t => t.status === "In Progress").length,
        inReview: myTasks.filter(t => t.status === "In Review").length,
        completed: myTasks.filter(t => t.status === "Reviewed" || t.status === "Completed").length,
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-br from-[#1a2b4c] to-[#2a4a7f] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-1">Welcome back, {loggedInUser?.fullName || "Worker"} </h2>
                    {/* <p className="text-white/60 text-sm">Here's your task overview for today</p> */}
                </div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute top-4 right-8 w-20 h-20 bg-white/5 rounded-full" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total", value: summary.total, color: "text-[#1a2b4c]", bg: "bg-[#1a2b4c]/5" },
                    { label: "In Progress", value: summary.inProgress, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "In Review", value: summary.inReview, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Done", value: summary.completed, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Task Cards */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">My Tasks</h3>
                {myTasks.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <FaClipboardList className="mx-auto text-4xl text-gray-300 mb-3" />
                        <p className="text-gray-400">No tasks assigned to you yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {myTasks.map((task) => {
                            const pc = priorityColor(task.priority);
                            return (
                                <div
                                    key={task.id}
                                    onClick={() => navigate(`/task-details/${task.id}`)}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-[#1a2b4c]/20 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                                >
                                    {/* Top accent line */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${pc.bar} opacity-60 group-hover:opacity-100 transition-opacity`} />

                                    <div className="flex items-start justify-between mb-3 pt-1">
                                        <h4 className="font-semibold text-gray-800 text-sm leading-snug pr-2 group-hover:text-[#1a2b4c] transition-colors line-clamp-2">
                                            {task.name}
                                        </h4>
                                        <FaArrowRight className="text-gray-300 group-hover:text-[#1a2b4c] transition-colors mt-0.5 shrink-0" size={12} />
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${pc.badge}`}>
                                            <FaFlag className="inline mr-1" size={8} />{task.priority}
                                        </span>
                                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </div>

                                    {/* Deadline */}
                                    {task.endDate && (
                                        <div className="flex items-center text-xs text-gray-400 mb-3">
                                            <FaCalendarAlt className="mr-1.5" size={10} />
                                            <span>Due: {task.endDate}</span>
                                        </div>
                                    )}

                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Progress</span>
                                            <span className="text-xs font-semibold text-gray-600">{task.progress || 0}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${pc.bar}`}
                                                style={{ width: `${task.progress || 0}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Est Time */}
                                    {task.estimatedTime && (
                                        <div className="flex items-center text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                                            <FaClock className="mr-1.5" size={10} />
                                            <span>{task.estimatedTime}h estimated</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkerDashboard;
