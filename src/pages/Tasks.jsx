import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../redux/tasksSlice';
import { FaPlus, FaEdit, FaTrash, FaListUl, FaImage, FaLink, FaBold, FaItalic, FaStrikethrough, FaCode, FaPaperclip } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';

function Tasks() {
  const [isAddTask, setIsAddTask] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const users = useSelector((state) => state.auth.users);
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

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
    budget: "",
    attachments: []
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState({ name: "", assignee: "", priority: "" });
  const [appliedQuery, setAppliedQuery] = useState({ name: "", assignee: "", priority: "" });

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
      budget: "",
      attachments: []
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchName = task.name?.toLowerCase().includes(appliedQuery.name.toLowerCase()) ?? false;
    const matchAssignee = appliedQuery.assignee ? task.assignee === appliedQuery.assignee : true;
    const matchPriority = appliedQuery.priority ? task.priority === appliedQuery.priority : true;
    return matchName && matchAssignee && matchPriority;
  });

  const currentTasks = filteredTasks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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

            {/* Rich Text Editor Mockup */}
            <div className="border border-gray-300 rounded bg-white">
              <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center space-x-4 text-gray-600">
                <select className="bg-transparent border-none text-gray-600 focus:outline-none text-sm">
                  <option>Paragraph</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
                <div className="h-4 w-px bg-gray-300"></div>
                <button type="button" className="hover:text-black"><FaBold /></button>
                <button type="button" className="hover:text-black"><FaItalic /></button>
                <button type="button" className="hover:text-black"><FaStrikethrough /></button>
                <button type="button" className="hover:text-black font-serif font-bold">&lt;&gt;</button>
                <button type="button" className="hover:text-black"><FaCode /></button>
                <button type="button" className="hover:text-black"><FaLink /></button>
                <button type="button" className="hover:text-black"><FaListUl /></button>
                <button type="button" className="hover:text-black font-semibold text-[10px]">1<br />2</button>
                <button type="button" className="hover:text-black"><FaImage /></button>
              </div>
              <textarea
                rows="6"
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                className="w-full p-4 focus:outline-none text-sm resize-y"
              ></textarea>
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
                    {users.map(u => (
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
                  <label className="w-1/3 font-semibold text-gray-800">Estimated time</label>
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
                {/* <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Category</label>
                  <select
                    value={taskData.category}
                    onChange={(e) => setTaskData({ ...taskData, category: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-500 focus:outline-none"
                  >
                    <option value=""></option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                  </select>
                </div> */}
                {/* <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Version</label>
                  <select
                    value={taskData.version}
                    onChange={(e) => setTaskData({ ...taskData, version: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-500 focus:outline-none"
                  >
                    <option value=""></option>
                    <option value="v1.0">v1.0</option>
                    <option value="v2.0">v2.0</option>
                  </select>
                </div> */}
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
              </div>
            </div>

            {/* Other & Costs (Optional structure from image) */}
            {/* <div>
              <h3 className="text-xs font-bold text-gray-700 tracking-wider mb-4 pb-2 border-b border-gray-200">OTHER</h3>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-700 tracking-wider mb-4 pb-2 border-b border-gray-200">COSTS</h3>
              <div className="max-w-md space-y-4 text-sm">
                <div className="flex items-center">
                  <label className="w-1/3 font-semibold text-gray-800">Budget</label>
                  <select
                    value={taskData.budget}
                    onChange={(e) => setTaskData({ ...taskData, budget: e.target.value })}
                    className="w-2/3 px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-500 focus:outline-none"
                  >
                    <option value=""></option>
                    <option value="$1,000">$1,000</option>
                    <option value="$5,000">$5,000</option>
                  </select>
                </div>
              </div>
            </div> */}

            {/* Attachments */}
            {/* <div>
              <h3 className="text-xs font-bold text-gray-700 tracking-wider mb-4 pb-2 border-b border-gray-200">ATTACHMENTS</h3>
              <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm flex flex-col items-center justify-center p-8 text-gray-500 hover:bg-gray-100 transition cursor-pointer mb-2">
                <FaPaperclip className="text-4xl text-gray-400 mb-2" />
                <span>Drop files here or click to attach files.</span>
              </div>
              <button type="button" className="text-[#0b64a3] text-sm flex items-center space-x-1 hover:underline">
                <FaPaperclip size={12} />
                <span>Attach files</span>
              </button>
            </div> */}

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
                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">ID</th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Task Name</th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Assignee</th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Priority</th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Est. Time</th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Dates</th>
                <th className="px-6 py-4 font-semibold text-[#1a2b4c] text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task, index) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">#{task.id.slice(-4)}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{task.name}</td>
                  <td className="px-6 py-4">{task.assignee || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Low' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {task.priority || 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{task.estimatedTime ? `${task.estimatedTime}h` : '-'}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {task.startDate || task.endDate ? (
                      <>
                        {task.startDate || 'none'} - {task.endDate || 'none'}
                      </>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-4">
                    <button onClick={() => handleEditTask(task)} className="text-[#1a2b4c] hover:text-[#263f6e] transition-colors"><FaEdit size={16} /></button>
                    <button onClick={() => handleDeleteTask(task)} className="text-red-500 hover:text-red-600 transition-colors"><FaTrash size={15} /></button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
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
