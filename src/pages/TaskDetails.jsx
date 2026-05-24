import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateTask, submitTask } from "../redux/tasksSlice";
import { toast } from "react-toastify";
import { FaArrowLeft, FaFlag, FaClock, FaCalendarAlt, FaPlay, FaPaperPlane, FaCheckCircle } from "react-icons/fa";

function TaskDetails() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const task = useSelector((state) => state.tasks.tasks.find((t) => t.id === taskId));
    const [submissionText, setSubmissionText] = useState("");
    const [showSubmitForm, setShowSubmitForm] = useState(false);

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

    const handleStartTask = () => {
        dispatch(updateTask({ ...task, status: "In Progress", progress: Math.max(task.progress || 0, 10) }));
        toast.success("Task started! Status changed to In Progress.");
    };

    const handleSubmitTask = () => {
        if (!submissionText.trim()) {
            toast.error("Please describe your work before submitting.");
            return;
        }
        dispatch(submitTask({ id: task.id, submission: submissionText }));
        toast.success("Task submitted for review!");
        setShowSubmitForm(false);
        setSubmissionText("");
    };

    const priorityStyles = {
        High: { badge: "bg-red-500/10 text-red-500 border-red-500/20", dot: "bg-red-500" },
        Normal: { badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" },
        Low: { badge: "bg-sky-500/10 text-sky-500 border-sky-500/20", dot: "bg-sky-500" },
    };

    const statusStyles = {
        New: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        "In Progress": "bg-amber-500/10 text-amber-500 border-amber-500/20",
        "In Review": "bg-purple-500/10 text-purple-500 border-purple-500/20",
        Reviewed: "bg-teal-500/10 text-teal-500 border-teal-500/20",
        Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const ps = priorityStyles[task.priority] || priorityStyles.Normal;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-gray-500 hover:text-[#1a2b4c] transition-colors group"
            >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={12} />
                Back to Dashboard
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`h-2 ${ps.dot}`} />
                <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                            <p className="text-xs text-gray-400 font-mono mb-1">#{task.id.toString().slice(-4)}</p>
                            <h1 className="text-xl font-bold text-gray-900">{task.name}</h1>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${ps.badge}`}>
                                <FaFlag className="inline mr-1" size={10} />{task.priority}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusStyles[task.status] || statusStyles.New}`}>
                                {task.status}
                            </span>
                            {task.isLateSubmission && (
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border bg-red-500/10 text-red-500 border-red-500/20`}>
                                    Late Submission
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Assignee</p>
                            <p className="text-sm font-medium text-gray-700">{task.assignee || "—"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center"><FaCalendarAlt className="mr-1" size={8} />Deadline</p>
                            <p className="text-sm font-medium text-gray-700">{task.endDate || "—"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 flex items-center"><FaClock className="mr-1" size={8} />Est. Time</p>
                            <p className="text-sm font-medium text-gray-700">{task.estimatedTime ? `${task.estimatedTime}h` : "—"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Progress</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div className={`h-full rounded-full ${ps.dot}`} style={{ width: `${task.progress || 0}%` }} />
                                </div>
                                <span className="text-xs font-semibold text-gray-600">{task.progress || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Description</h3>
                {task.description ? (
                    <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: task.description }} />
                ) : (
                    <p className="text-gray-400 text-sm italic">No description provided.</p>
                )}
            </div>

            {/* Review Feedback (if previously rejected) */}
            {task.reviewFeedback && task.status === "In Progress" && (
                <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
                    <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Reviewer Feedback</h3>
                    <p className="text-sm text-amber-800">{task.reviewFeedback}</p>
                </div>
            )}

            {/* Submission Content (if already submitted) */}
            {task.submission && (
                <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6">
                    <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Your Submission</h3>
                    <p className="text-sm text-purple-800 whitespace-pre-wrap">{task.submission}</p>
                </div>
            )}

            {/* Submit Form */}
            {showSubmitForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Submit Your Work</h3>
                    <textarea
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Describe what you've completed, any notes for the reviewer..."
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a2b4c] focus:ring-1 focus:ring-[#1a2b4c]/20 transition-all resize-none bg-gray-50/50"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={handleSubmitTask}
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm flex items-center"
                        >
                            <FaPaperPlane className="mr-2" size={12} />Submit for Review
                        </button>
                        <button
                            onClick={() => { setShowSubmitForm(false); setSubmissionText(""); }}
                            className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                {task.status === "New" && (
                    <button
                        onClick={handleStartTask}
                        className="px-6 py-3 bg-gradient-to-r from-[#1a2b4c] to-[#2a4a7f] text-white text-sm font-semibold rounded-xl hover:from-[#0f192d] hover:to-[#1a2b4c] transition-all shadow-md hover:shadow-lg flex items-center"
                    >
                        <FaPlay className="mr-2" size={12} />Start Task
                    </button>
                )}

                {task.status === "In Progress" && !showSubmitForm && (
                    <button
                        onClick={() => setShowSubmitForm(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg flex items-center"
                    >
                        <FaPaperPlane className="mr-2" size={12} />Submit Task
                    </button>
                )}

                {(task.status === "Reviewed" || task.status === "Completed") && (
                    <div className="flex items-center text-emerald-600 bg-emerald-50 px-5 py-3 rounded-xl border border-emerald-200">
                        <FaCheckCircle className="mr-2" size={14} />
                        <span className="text-sm font-semibold">This task has been completed & reviewed</span>
                    </div>
                )}

                {task.status === "In Review" && (
                    <div className="flex items-center text-purple-600 bg-purple-50 px-5 py-3 rounded-xl border border-purple-200">
                        <FaClock className="mr-2" size={14} />
                        <span className="text-sm font-semibold">Awaiting reviewer feedback...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskDetails;
