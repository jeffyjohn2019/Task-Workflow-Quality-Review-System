import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, loginUser } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

function Profile() {
  const loggedInState = useSelector((state) => state.auth.loggedInUser);
  const users = useSelector((state) => state.auth.users);

  // Fallback to first user in list if state is cleared after a page reload
  const loggedInUser = loggedInState || users[0];
  const dispatch = useDispatch();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (passwordData.currentPassword !== loggedInUser.password) {
      toast.error("Current password is incorrect");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Update user
    const updatedUser = { ...loggedInUser, password: passwordData.newPassword };

    // Dispatch to update the user in the list
    dispatch(updateUser({
      originalEmail: loggedInUser.email,
      ...updatedUser
    }));

    // Dispatch to update the current session
    dispatch(loginUser(updatedUser));

    toast.success("Password updated successfully");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  if (!loggedInUser) {
    return <div className="p-8 text-center text-gray-500">No user logged in</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="bg-[#1a2b4c] rounded-md p-4 flex justify-between items-center text-white shadow-md">
        <h2 className="text-xl font-medium tracking-wide">My Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Profile Info Card */}
        <div className="col-span-1 bg-white rounded-md shadow-sm border border-gray-100 p-6 flex flex-col items-center">
          <FaUserCircle className="text-8xl text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800">{loggedInUser.fullName}</h3>
          <p className="text-sm text-gray-500 mb-4">@{loggedInUser.username}</p>

          <div className="w-full space-y-3 mt-2 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Role:</span>
              <span className="text-gray-800 font-semibold">{loggedInUser.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Email:</span>
              <span className="text-gray-800 font-semibold">{loggedInUser.email}</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="col-span-2 bg-white rounded-md shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-[#1a2b4c] mb-6 border-b border-gray-100 pb-2">Change Password</h3>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-[#1a2b4c] pr-10"
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#1a2b4c]">
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#1a2b4c] pr-10"
                  placeholder="Enter new password"
                />
                <button type="button" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#1a2b4c]">
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#1a2b4c] pr-10"
                  placeholder="Confirm new password"
                />
                <button type="button" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#1a2b4c]">
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#1a2b4c] text-white font-semibold text-sm rounded hover:bg-[#0f192d] transition shadow uppercase tracking-wide"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
