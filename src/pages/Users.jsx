import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { registerUser, updateUser, deleteUser } from '../redux/authSlice';
import { FaPlus, FaEye, FaEdit, FaTrash, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';

function Users() {
    const [isAddUser, setIsAddUser] = useState(false);
    const [isEditUser, setIsEditUser] = useState(false);
    const [editingEmail, setEditingEmail] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const users = useSelector((state) => state.auth.users);
    const dispatch = useDispatch();

    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        username: "",
        role: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState({ fullName: "", email: "", role: "" });
    const [appliedQuery, setAppliedQuery] = useState({ fullName: "", email: "", role: "" });

    const handleEditUser = (user) => {
        setSignupData({
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            role: user.role,
            password: user.password,
            confirmPassword: user.password
        });
        setEditingEmail(user.email);
        setIsEditUser(true);
        setIsAddUser(true);
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            dispatch(deleteUser(userToDelete.email));
            toast.success("User deleted successfully");
            setUserToDelete(null);
        }
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (!signupData.fullName || !signupData.email || !signupData.username || !signupData.role || !signupData.password) {
            toast.error("Please fill all required fields");
            return;
        }
        if (signupData.password !== signupData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (isEditUser) {
            const userExists = users.find((u) => u.email === signupData.email && u.email !== editingEmail);
            if (userExists) {
                toast.error("Email already registered");
                return;
            }

            dispatch(
                updateUser({
                    originalEmail: editingEmail,
                    fullName: signupData.fullName,
                    username: signupData.username,
                    email: signupData.email,
                    role: signupData.role,
                    password: signupData.password,
                })
            );
            toast.success("User updated successfully");
            setSignupData({
                fullName: "",
                email: "",
                username: "",
                role: "",
                password: "",
                confirmPassword: ""
            });
            setIsAddUser(false);
            setIsEditUser(false);
            setEditingEmail(null);
        } else {
            // Check if user already exists
            const userExists = users.find((u) => u.email === signupData.email);
            if (userExists) {
                toast.error("Email already registered");
                return;
            }

            dispatch(
                registerUser({
                    fullName: signupData.fullName,
                    username: signupData.username,
                    email: signupData.email,
                    role: signupData.role,
                    password: signupData.password,
                })
            );
            toast.success("User added successfully");
            setSignupData({
                fullName: "",
                email: "",
                username: "",
                role: "",
                password: "",
                confirmPassword: ""
            });
            setIsAddUser(false);
        }
    };

    const closeAddUser = () => {
        setIsAddUser(false);
        setIsEditUser(false);
        setEditingEmail(null);
        setSignupData({
            fullName: "",
            email: "",
            username: "",
            role: "",
            password: "",
            confirmPassword: ""
        });
    };

    const filteredUsers = users.filter((user) => {
        const matchName = user.fullName?.toLowerCase().includes(appliedQuery.fullName.toLowerCase()) ?? false;
        const matchEmail = user.email?.toLowerCase().includes(appliedQuery.email.toLowerCase()) ?? false;
        const matchRole = appliedQuery.role ? user.role === appliedQuery.role : true;
        return matchName && matchEmail && matchRole;
    });

    const currentUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    if (isAddUser) {
        return (
            <div className="space-y-4">
                <div className="text-sm text-gray-500 mb-4">
                    <span className="hover:underline cursor-pointer" onClick={closeAddUser}>Users</span> &gt; <span className="font-semibold text-gray-700">{isEditUser ? "Edit User" : "Add User"}</span>
                </div>

                <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold text-[#1a2b4c] text-center mb-8">{isEditUser ? "Edit User" : "Add User"}</h2>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Full Name *</label>
                                <input
                                    type="text"
                                    value={signupData.fullName}
                                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#eef2f6] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1a2b4c]"
                                    placeholder="Enter fullname"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Email *</label>
                                <input
                                    type="email"
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1a2b4c]"
                                    placeholder="Enter email"
                                />
                            </div>

                            {/* Role */}
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Role *</label>
                                <select
                                    value={signupData.role}
                                    onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1a2b4c] appearance-none bg-transparent"
                                >
                                    <option value="" className="text-gray-400">Select Role</option>
                                    <option value="Worker">Worker</option>
                                    <option value="Reviewer">Reviewer</option>
                                </select>
                                <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            {/* Username */}
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Username *</label>
                                <input
                                    type="text"
                                    value={signupData.username}
                                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#eef2f6] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1a2b4c]"
                                    placeholder="Enter username"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Password *</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={signupData.password}
                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#eef2f6] border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1a2b4c] tracking-[0.2em] pr-10"
                                    placeholder="Enter password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Confirm Password *</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={signupData.confirmPassword}
                                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1a2b4c] tracking-[0.2em] pr-10"
                                    placeholder="Enter confirm password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={closeAddUser}
                                className="px-6 py-2 border border-[#1a2b4c] text-[#1a2b4c] font-semibold text-xs tracking-wide rounded hover:bg-blue-50 transition-colors"
                                style={{ letterSpacing: '0.05em' }}
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#1a2b4c] text-white font-semibold text-xs tracking-wide rounded hover:bg-[#0f192d] transition-colors"
                                style={{ letterSpacing: '0.05em' }}
                            >
                                {isEditUser ? "UPDATE" : "ADD"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header block */}
            <div className="bg-[#1a2b4c] rounded-md p-4 flex justify-between items-center text-white shadow-md">
                <h2 className="text-xl font-medium tracking-wide">Users</h2>
                <button
                    onClick={() => setIsAddUser(true)}
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
                        placeholder="Full Name"
                        value={searchQuery.fullName}
                        onChange={(e) => setSearchQuery({ ...searchQuery, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a2b4c]"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Email"
                        value={searchQuery.email}
                        onChange={(e) => setSearchQuery({ ...searchQuery, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1a2b4c]"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <select
                        value={searchQuery.role}
                        onChange={(e) => setSearchQuery({ ...searchQuery, role: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded text-sm text-gray-500 focus:outline-none focus:border-[#1a2b4c] bg-white appearance-none"
                    >
                        <option value="">Role</option>
                        <option value="Worker">Worker</option>
                        <option value="Reviewer">Reviewer</option>
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
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Index</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Full Name</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Email</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Username</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c]">Role</th>
                                <th className="px-6 py-4 font-semibold text-[#1a2b4c] text-center w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{user.fullName}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 font-medium text-gray-700">{user.username}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4 flex justify-center space-x-4">
                                        <button onClick={() => handleEditUser(user)} className="text-[#1a2b4c] hover:text-[#263f6e] transition-colors"><FaEdit size={16} /></button>
                                        <button onClick={() => handleDeleteUser(user)} className="text-red-500 hover:text-red-600 transition-colors"><FaTrash size={15} /></button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && (
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
                            {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length}
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
                                className={`p-1 ${currentPage * rowsPerPage >= filteredUsers.length ? 'text-gray-300' : 'text-gray-600 hover:text-black'}`}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage * rowsPerPage >= filteredUsers.length}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                message={`Confirm to delete user: ${userToDelete?.fullName}!`}
            />
        </div>
    );
}

export default Users;
