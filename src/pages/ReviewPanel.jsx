import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { reviewTask } from "../redux/tasksSlice";
import { toast } from "react-toastify";
import { FaArrowLeft, FaFlag, FaUserAlt, FaCalendarAlt, FaCheck, FaTimes, FaClipboardCheck } from "react-icons/fa";

const CHECKLIST_ITEMS = [
    { id: "code_quality", label: "Code Quality & Best Practices" },
    { id: "requirements_met", label: "Requirements Fully Met" },
    { id: "deadline_adherence", label: "Deadline Adherence" },
    { id: "test_coverage", label: "Test Coverage Adequate" },
    { id: "documentation", label: "Documentation Updated" },
];

function ReviewPanel() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const task = useSelector((state) => state.tasks.tasks.find((t) => t.id === taskId));

    const [feedback, setFeedback] = useState("");
    const [checklist, setChecklist] = useState([]);

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-400 text-lg">Task not found.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-[#1a2b4c] hover:underline text-sm">
                    ← Go Back
                </button>
            </div>
        );
    }

    const toggleChecklist = (itemLabel) => {
        setChecklist((prev) =>
            prev.includes(itemLabel) ? prev.filter((i) => i !== itemLabel) : [...prev, itemLabel]
        );
    };

    const handleApprove = () => {
        dispatch(reviewTask({ id: task.id, approved: true, feedback, checklist }));
        toast.success("Task approved successfully!");
        navigate("/reviewer-dashboard");
    };

    const handleReject = () => {
        if (!feedback.trim()) {
            toast.error("Please provide feedback when rejecting a task.");
            return;
        }
        dispatch(reviewTask({ id: task.id, approved: false, feedback, checklist }));
        toast.info("Task rejected. Worker will be notified.");
        navigate("/reviewer-dashboard");
    };

    const priorityStyles = {
        High: "bg-red-500/10 text-red-500 border-red-500/20",
        Normal: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        Low: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-gray-500 hover:text-purple-700 transition-colors group"
            >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={12} />
                Back to Reviewer Dashboard
            </button>

            {/* Task Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-2 bg-purple-500" />
                <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                            <p className="text-xs text-gray-400 font-mono mb-1">#{task.id.toString().slice(-4)}</p>
                            <h1 className="text-xl font-bold text-gray-900">{task.name}</h1>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${priorityStyles[task.priority] || priorityStyles.Normal}`}>
                                <FaFlag className="inline mr-1" size={10} />{task.priority}
                            </span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-purple-500/10 text-purple-500 border-purple-500/20">
                                In Review
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center"><FaUserAlt className="mr-1" size={8} />Assignee</p>
                            <p className="text-sm font-medium text-gray-700">{task.assignee || "—"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center"><FaCalendarAlt className="mr-1" size={8} />Deadline</p>
                            <p className="text-sm font-medium text-gray-700">{task.endDate || "—"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Progress</p>
                            <p className="text-sm font-medium text-gray-700">{task.progress || 0}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <FaClipboardCheck className="mr-2 text-purple-500" />Submission Content
                </h3>
                {task.submission ? (
                    <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{task.submission}</p>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm italic">No submission content available.</p>
                )}
            </div>

            {/* Quality Checklist */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Quality Checklist</h3>
                <div className="space-y-2">
                    {CHECKLIST_ITEMS.map((item) => {
                        const isChecked = checklist.includes(item.label);
                        return (
                            <label
                                key={item.id}
                                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${isChecked
                                        ? "bg-emerald-50 border-emerald-200"
                                        : "bg-gray-50 border-gray-100 hover:border-gray-200 hover:bg-gray-100/50"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleChecklist(item.label)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mr-3 transition-all ${isChecked
                                        ? "bg-emerald-500 border-emerald-500"
                                        : "border-gray-300"
                                    }`}>
                                    {isChecked && <FaCheck className="text-white" size={10} />}
                                </div>
                                <span className={`text-sm ${isChecked ? "text-emerald-700 font-medium" : "text-gray-600"}`}>
                                    {item.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
                <p className="text-[10px] text-gray-400 mt-3">{checklist.length}/{CHECKLIST_ITEMS.length} items checked</p>
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Reviewer Feedback</h3>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide detailed feedback on the submission quality, areas of improvement, or any required changes..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all resize-none bg-gray-50/50"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pb-6">
                <button
                    onClick={handleApprove}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center"
                >
                    <FaCheck className="mr-2" size={12} />Approve
                </button>
                <button
                    onClick={handleReject}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center"
                >
                    <FaTimes className="mr-2" size={12} />Reject
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default ReviewPanel;
