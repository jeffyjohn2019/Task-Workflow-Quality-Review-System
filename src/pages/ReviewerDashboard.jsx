import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaClipboardCheck, FaUserAlt, FaFlag, FaArrowRight, FaClock } from "react-icons/fa";

function ReviewerDashboard() {
    const tasks = useSelector((state) => state.tasks.tasks);
    const navigate = useNavigate();

    const pendingReview = tasks.filter((t) => t.status === "In Review");
    const reviewed = tasks.filter((t) => t.status === "Reviewed");

    const priorityBadge = (p) => ({
        High: "bg-red-500/10 text-red-400 border-red-500/20",
        Normal: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Low: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    }[p] || "bg-gray-500/10 text-gray-400 border-gray-500/20");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-1">Review Dashboard</h2>
                    <p className="text-white/60 text-sm">Manage and review submitted task work</p>
                </div>
                <FaClipboardCheck className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl text-white/10" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-purple-500 font-semibold uppercase tracking-wider">Pending Review</p>
                            <p className="text-3xl font-bold text-purple-700 mt-1">{pendingReview.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <FaClock className="text-purple-500 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-teal-50 rounded-xl p-5 border border-teal-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-teal-500 font-semibold uppercase tracking-wider">Reviewed</p>
                            <p className="text-3xl font-bold text-teal-700 mt-1">{reviewed.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                            <FaClipboardCheck className="text-teal-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Review Cards */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                    Submissions Awaiting Review
                </h3>

                {pendingReview.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <FaClipboardCheck className="mx-auto text-4xl text-gray-300 mb-3" />
                        <p className="text-gray-400">No submissions pending review.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {pendingReview.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => navigate(`/review-panel/${task.id}`)}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-purple-200 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                            >
                                {/* Top accent */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-start justify-between mb-3 pt-1">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-mono">#{task.id.toString().slice(-4)}</p>
                                        <h4 className="font-semibold text-gray-800 text-sm leading-snug group-hover:text-purple-700 transition-colors line-clamp-2 mt-0.5">
                                            {task.name}
                                        </h4>
                                    </div>
                                    <FaArrowRight className="text-gray-300 group-hover:text-purple-500 transition-colors mt-1 shrink-0" size={12} />
                                </div>

                                {/* Assignee */}
                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                    <FaUserAlt className="mr-1.5" size={9} />
                                    <span>{task.assignee || "Unassigned"}</span>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${priorityBadge(task.priority)}`}>
                                        <FaFlag className="inline mr-1" size={8} />{task.priority}
                                    </span>
                                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20">
                                        In Review
                                    </span>
                                </div>

                                {/* Submission preview */}
                                {task.submission && (
                                    <div className="bg-gray-50 rounded-lg p-2.5 mt-2">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Submission Preview</p>
                                        <p className="text-xs text-gray-600 line-clamp-2">{task.submission}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recently Reviewed */}
            {reviewed.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Recently Reviewed</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-6 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">Task</th>
                                        <th className="px-6 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">Assignee</th>
                                        <th className="px-6 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviewed.map((task) => (
                                        <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                            <td className="px-6 py-3 font-medium text-gray-700">{task.name}</td>
                                            <td className="px-6 py-3 text-gray-500">{task.assignee}</td>
                                            <td className="px-6 py-3 text-gray-500 text-xs">{task.reviewFeedback || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReviewerDashboard;
