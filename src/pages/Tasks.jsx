import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../redux/tasksSlice';
import { FaPlus, FaEdit, FaTrash, FaPaperclip, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
  'list', 'bullet',
  'link', 'image'
];

function Tasks() {
  const [isAddTask, setIsAddTask] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const users = useSelector((state) => state.auth.users);
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [inlineEdit, setInlineEdit] = useState({ taskId: null, field: null });

  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    assignee: "",
    accountable: "",
    estimatedTime: "",
    storyPoints: "",
    remainingHours: "",
    startDate: "",
    endDate: "",
    progress: 0,
    category: "",
    version: "",
    priority: "Normal",
    status: "New",
    budget: "",
    attachments: []
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState({ name: "", assignee: "", priority: "", status: "" });
  const [appliedQuery, setAppliedQuery] = useState({ name: "", assignee: "", priority: "", status: "" });

  // Handle Edit
  const handleEditTask = (task) => {
    setTaskData({
      name: task.name,
      description: task.description,
      assignee: task.assignee,
      accountable: task.accountable,
      estimatedTime: task.estimatedTime,
      storyPoints: task.storyPoints,
      remainingHours: task.remainingHours,
      startDate: task.startDate,
      endDate: task.endDate,
      progress: task.progress,
      category: task.category,
      version: task.version,
      priority: task.priority,
      status: task.status || "New",
      budget: task.budget,
      attachments: task.attachments || []
    });
    setEditingTaskId(task.id);
    setIsEditTask(true);
    setIsAddTask(true);
  };

  // Handle Delete
  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete.id));
      toast.success("Task deleted successfully");
      setTaskToDelete(null);
    }
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskData.name) {
      toast.error("Please enter a task name");
      return;
    }

    if (isEditTask) {
      dispatch(
        updateTask({
          id: editingTaskId,
          ...taskData
        })
      );
      toast.success("Task updated successfully");
    } else {
      dispatch(
        addTask({
          ...taskData
        })
      );
      toast.success("Task added successfully");
    }

    closeAddTask();
  };

  const closeAddTask = () => {
    setIsAddTask(false);
    setIsEditTask(false);
    setEditingTaskId(null);
    setTaskData({
      name: "",
      description: "",
      assignee: "",
      accountable: "",
      estimatedTime: "",
      storyPoints: "",
      remainingHours: "",
      startDate: "",
      endDate: "",
      progress: 0,
      category: "",
      version: "",
      priority: "Normal",
      status: "New",
      budget: "",
      attachments: []
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchName = task.name?.toLowerCase().includes(appliedQuery.name.toLowerCase()) ?? false;
    const matchAssignee = appliedQuery.assignee ? task.assignee === appliedQuery.assignee : true;
    const matchPriority = appliedQuery.priority ? task.priority === appliedQuery.priority : true;
    const matchStatus = appliedQuery.status ? task.status === appliedQuery.status : true;
    return matchName && matchAssignee && matchPriority && matchStatus;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <FaSort className="text-gray-300 ml-1 inline-block hover:text-gray-500 transition-colors" size={12} />;
    }
    if (sortDirection === 'asc') {
      return <FaSortUp className="text-[#1a2b4c] ml-1 inline-block" size={12} />;
    }
    return <FaSortDown className="text-[#1a2b4c] ml-1 inline-block" size={12} />;
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortField) return 0;
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'id') {
      aVal = Number(a.id) || 0;
      bVal = Number(b.id) || 0;
    } else if (sortField === 'name') {
      aVal = (a.name || "").toLowerCase();
      bVal = (b.name || "").toLowerCase();
    } else if (sortField === 'assignee') {
      aVal = (a.assignee || "").toLowerCase();
      bVal = (b.assignee || "").toLowerCase();
    } else if (sortField === 'priority') {
      const priorityRank = { "High": 3, "Normal": 2, "Low": 1 };
      aVal = priorityRank[a.priority] || 0;
      bVal = priorityRank[b.priority] || 0;
    } else if (sortField === 'estimatedTime') {
      aVal = Number(a.estimatedTime) || 0;
      bVal = Number(b.estimatedTime) || 0;
    } else if (sortField === 'startDate') {
      aVal = a.startDate || "";
      bVal = b.startDate || "";
    } else if (sortField === 'status') {
      const statusRank = { "New": 1, "In Progress": 2, "In Review": 3, "Reviewed": 4, "Completed": 5 };
      aVal = statusRank[a.status] || 0;
      bVal = statusRank[b.status] || 0;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const currentTasks = sortedTasks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  if (isAddTask) {
    return (
      <div className="space-y-4 pb-12">
        <div className="text-sm text-gray-500 mb-4">
          <span className="hover:underline cursor-pointer" onClick={closeAddTask}>Tasks</span> &gt; <span className="font-semibold text-gray-700">{isEditTask ? "Edit Task" : "New Task"}</span>
        </div>

        <div className="bg-white rounded-md shadow max-w-4xl mx-auto overflow-hidden text-sm">
          {/* Header */}
          <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl text-[#0b64a3]"><span className="text-gray-700">{isEditTask ? 'Edit' : 'New'}</span> <span className="text-[#32c943] font-semibold">Task</span></h2>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
            <div>
              <input
                type="text"
                value={taskData.name}
                onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-[#32c943]"
              />
            </div>

            {/* Real React Quill Editor */}
            <div className="border border-gray-300 rounded-md overflow-hidden bg-white focus-within:border-[#32c943] focus-within:ring-1 focus-within:ring-[#32c943] transition-all">
              <ReactQuill
                theme="snow"
                value={taskData.description}
                onChange={(content) => setTaskData({ ...taskData, description: content })}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write task description..."
              />
            </div>

            {/* People Section */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 tracking-wider mb-4 pb-2 border-b border-gray-200">PEOPLE</h3>
              <div className="max-w-md space-y-4 text-sm">
                <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Assignee</label>
                  <select
                    value={taskData.assignee}
                    onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-500 focus:outline-none"
                  >
                    <option value="">Type to search</option>
                    {users.filter(u => u.role !== 'Admin').map(u => (
                      <option key={u.email} value={u.fullName}>{u.fullName}</option>
                    ))}
                  </select>
                </div>
                {/* <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Accountable</label>
                  <select
                    value={taskData.accountable}
                    onChange={(e) => setTaskData({ ...taskData, accountable: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-500 focus:outline-none"
                  >
                    <option value="">Type to search</option>
                    {users.map(u => (
                      <option key={u.email} value={u.fullName}>{u.fullName}</option>
                    ))}
                  </select>
                </div> */}
              </div>
            </div>

            {/* Estimates and Time */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 tracking-wider mb-4 pb-2 border-b border-gray-200">ESTIMATES AND TIME</h3>
              <div className="max-w-md space-y-4 text-sm">
                <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Estimated time(Hrs)</label>
                  <input
                    type="number"
                    value={taskData.estimatedTime}
                    onChange={(e) => setTaskData({ ...taskData, estimatedTime: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white focus:outline-none"
                  />
                </div>
                {/* <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Story Points</label>
                  <input
                    type="number"
                    value={taskData.storyPoints}
                    onChange={(e) => setTaskData({ ...taskData, storyPoints: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Remaining hours</label>
                  <input
                    type="number"
                    value={taskData.remainingHours}
                    onChange={(e) => setTaskData({ ...taskData, remainingHours: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white focus:outline-none"
                  />
                </div> */}
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 tracking-wider mb-4 pb-2 border-b border-gray-200">DETAILS</h3>
              <div className="max-w-md space-y-4 text-sm">
                <div className="flex flex-wrap items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Date</label>
                  <div className="w-2/3 flex space-x-2">
                    <input
                      type="date"
                      value={taskData.startDate}
                      onChange={(e) => setTaskData({ ...taskData, startDate: e.target.value })}
                      className="w-1/2 px-2 py-1.5 border border-gray-300 rounded bg-white focus:outline-none text-xs text-gray-500"
                      title="Start Date"
                    />
                    <span className="text-gray-400 mt-1">-</span>
                    <input
                      type="date"
                      value={taskData.endDate}
                      onChange={(e) => setTaskData({ ...taskData, endDate: e.target.value })}
                      className="w-1/2 px-2 py-1.5 border border-gray-300 rounded bg-white focus:outline-none text-xs text-gray-500"
                      title="End Date"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taskData.progress}
                    onChange={(e) => setTaskData({ ...taskData, progress: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800 text-[#0b64a3]">Priority *</label>
                  <select
                    value={taskData.priority}
                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none"
                    required
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800 text-[#0b64a3]">Status *</label>
                  <select
                    value={taskData.status}
                    onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none"
                    required
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="In Review">In Review</option>
                    <option value="Reviewed">Reviewed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-[#0b64a3] text-white font-medium text-sm rounded hover:bg-[#094d7d] transition flex items-center shadow-sm"
              >
                <span className="mr-2">✓</span> {isEditTask ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={closeAddTask}
                className="px-6 py-2 border border-gray-300 bg-white text-gray-700 font-medium text-sm rounded hover:bg-gray-50 transition flex items-center shadow-sm"
              >
                <span className="mr-2 text-gray-400">×</span> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header block */}
      <div className="bg-[#1a2b4c] rounded-md p-4 flex justify-between items-center text-white shadow-md">
        <h2 className="text-xl font-medium tracking-wide">Tasks</h2>
        <button
          onClick={() => setIsAddTask(true)}
          className="bg-white text-[#1a2b4c] w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 shadow transition-colors"
        >
          <FaPlus size={14} />
        </button>
      </div>

      {/* Search filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Task Name"
            value={searchQuery.name}
            onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a2b4c]"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <select
            value={searchQuery.assignee}
            onChange={(e) => setSearchQuery({ ...searchQuery, assignee: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-500 focus:outline-none focus:border-[#1a2b4c] bg-white"
          >
            <option value="">Assignee</option>
            {users.map(u => (
              <option key={u.email} value={u.fullName}>{u.fullName}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <select
            value={searchQuery.priority}
            onChange={(e) => setSearchQuery({ ...searchQuery, priority: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-500 focus:outline-none focus:border-[#1a2b4c] bg-white"
          >
            <option value="">Priority</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <select
            value={searchQuery.status}
            onChange={(e) => setSearchQuery({ ...searchQuery, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-500 focus:outline-none focus:border-[#1a2b4c] bg-white"
          >
            <option value="">Status</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="In Review">In Review</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => {
              setAppliedQuery(searchQuery);
              setCurrentPage(1);
            }}
            className="bg-[#1a2b4c] text-white px-6 py-2 rounded font-semibold text-xs tracking-wide hover:bg-[#0f192d] transition shadow"
            style={{ letterSpacing: '0.05em' }}
          >
            SEARCH
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 font-semibold text-[#1a2b4c] cursor-pointer select-none hover:bg-gray-50 transition-colors" onClick={() => handleSort('id')}>
                  ID {renderSortIcon('id')}
                </th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c] cursor-pointer select-none hover:bg-gray-50 transition-colors" onClick={() => handleSort('name')}>
                  Task Name {renderSortIcon('name')}
                </th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c] cursor-pointer select-none hover:bg-gray-50 transition-colors" onClick={() => handleSort('assignee')}>
                  Assignee {renderSortIcon('assignee')}
                </th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c] cursor-pointer select-none hover:bg-gray-50 transition-colors" onClick={() => handleSort('priority')}>
                  Priority {renderSortIcon('priority')}
                </th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c] cursor-pointer select-none hover:bg-gray-50 transition-colors" onClick={() => handleSort('status')}>
                  Status {renderSortIcon('status')}
                </th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c] cursor-pointer select-none hover:bg-gray-50 transition-colors" onClick={() => handleSort('estimatedTime')}>
                  Est. Time {renderSortIcon('estimatedTime')}
                </th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c] cursor-pointer select-none hover:bg-gray-50 transition-colors" onClick={() => handleSort('startDate')}>
                  Dates {renderSortIcon('startDate')}
                </th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c] text-center w-32 select-none">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task, index) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">#{task.id.slice(-4)}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{task.name}</td>
                  <td className="px-6 py-4">{task.assignee || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : task.priority === 'Low' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                      {task.priority || 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {inlineEdit.taskId === task.id && inlineEdit.field === 'status' ? (
                      <select
                        value={task.status || "New"}
                        onChange={(e) => {
                          dispatch(updateTask({ ...task, status: e.target.value }));
                          setInlineEdit({ taskId: null, field: null });
                          toast.success("Status updated inline");
                        }}
                        onBlur={() => setInlineEdit({ taskId: null, field: null })}
                        autoFocus
                        className="px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-800 focus:outline-none shadow-sm"
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="In Review">In Review</option>
                        <option value="Reviewed">Reviewed</option>
                      </select>
                    ) : (
                      <span
                        onClick={() => setInlineEdit({ taskId: task.id, field: 'status' })}
                        className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${task.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : task.status === 'In Review' ? 'bg-purple-50 text-purple-700 border-purple-200' : task.status === 'Reviewed' ? 'bg-teal-50 text-teal-700 border-teal-200' : task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
                        title="Click to edit status"
                      >
                        {task.status || 'New'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {inlineEdit.taskId === task.id && inlineEdit.field === 'estimatedTime' ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          defaultValue={task.estimatedTime}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              dispatch(updateTask({ ...task, estimatedTime: e.target.value }));
                              setInlineEdit({ taskId: null, field: null });
                              toast.success("Estimated time updated inline");
                            } else if (e.key === 'Escape') {
                              setInlineEdit({ taskId: null, field: null });
                            }
                          }}
                          onBlur={(e) => {
                            dispatch(updateTask({ ...task, estimatedTime: e.target.value }));
                            setInlineEdit({ taskId: null, field: null });
                          }}
                          autoFocus
                          className="w-16 px-1.5 py-0.5 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-[#1a2b4c]"
                        />
                        <span className="text-xs text-gray-500">h</span>
                      </div>
                    ) : (
                      <span
                        onClick={() => setInlineEdit({ taskId: task.id, field: 'estimatedTime' })}
                        className="cursor-pointer hover:text-[#1a2b4c] hover:underline decoration-dotted transition"
                        title="Click to edit hours"
                      >
                        {task.estimatedTime ? `${task.estimatedTime}h` : '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {inlineEdit.taskId === task.id && inlineEdit.field === 'dates' ? (
                      <div
                        className="flex flex-col space-y-1"
                        onBlur={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget)) {
                            setInlineEdit({ taskId: null, field: null });
                            toast.success("Dates updated inline");
                          }
                        }}
                      >
                        <input
                          type="date"
                          value={task.startDate || ""}
                          onChange={(e) => {
                            dispatch(updateTask({ ...task, startDate: e.target.value }));
                          }}
                          className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:outline-none"
                          title="Start Date"
                        />
                        <input
                          type="date"
                          value={task.endDate || ""}
                          onChange={(e) => {
                            dispatch(updateTask({ ...task, endDate: e.target.value }));
                          }}
                          className="px-1 py-0.5 text-xs border border-gray-300 rounded bg-white focus:outline-none"
                          title="End Date"
                        />
                      </div>
                    ) : (
                      <span
                        onClick={() => setInlineEdit({ taskId: task.id, field: 'dates' })}
                        className="cursor-pointer hover:text-[#1a2b4c] hover:underline decoration-dotted transition block"
                        title="Click to edit dates"
                      >
                        {task.startDate || task.endDate ? (
                          <>
                            {task.startDate || 'none'} - {task.endDate || 'none'}
                          </>
                        ) : '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center space-x-4">
                    <button onClick={() => handleEditTask(task)} className="text-[#1a2b4c] hover:text-[#263f6e] transition-colors"><FaEdit size={16} /></button>
                    <button onClick={() => handleDeleteTask(task)} className="text-red-500 hover:text-red-600 transition-colors"><FaTrash size={15} /></button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTasks.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>Rows per page:</span>
              <select
                className="focus:outline-none bg-transparent"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div>
              {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredTasks.length)} of {filteredTasks.length}
            </div>
            <div className="flex space-x-2">
              <button
                className={`p-1 ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:text-black'}`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <button
                className={`p-1 ${currentPage * rowsPerPage >= filteredTasks.length ? 'text-gray-300' : 'text-gray-600 hover:text-black'}`}
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * rowsPerPage >= filteredTasks.length}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDelete}
        message={`Confirm to delete task: ${taskToDelete?.name}!`}
      />
    </div>
  );
}

export default Tasks;
