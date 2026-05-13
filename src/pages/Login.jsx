import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../redux/authSlice";


function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users);

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup Form State
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
  });

  // Error State
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // LOGIN VALIDATION
  const validateLogin = () => {
    let newErrors = {};
console.log("loginData ", loginData)
    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(loginData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // SIGNUP VALIDATION
  const validateSignup = () => {
    let newErrors = {};
console.log("signupData ", signupData)
    if (!signupData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!signupData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(signupData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!signupData.role.trim()) {
      newErrors.role = "Role is required";
    }

    if (!signupData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // LOGIN SUBMIT
  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateLogin()) return;
console.log("users ", users)
    const userFound = users.find(
      (u) =>
        u.email === loginData.email && u.password === loginData.password
    );

    if (!userFound) {
      toast.error("Invalid email or password");
      return;
    }
    localStorage.setItem("token", "mytoken123");
    toast.success("Successfully logged in ");
    setLoginData({
      email: "",
      password: "",
    });

    navigate("/dashboard");
  };

  // SIGNUP SUBMIT
  const handleSignup = (e) => {
    e.preventDefault();

    if (!validateSignup()) return;
    
    const userExists = users.find((u) => u.email === signupData.email);
console.log("userExists ", userExists)
    if (userExists) {
      setErrors({ email: "Email already registered" });
      return;
    }

    dispatch(
      registerUser({
        fullName: signupData.fullName,
        email: signupData.email,
        role: signupData.role,
        password: signupData.password,
      })
    );
    localStorage.setItem("token", "mytoken123");
    toast.success("Successfully registered ");
    setSignupData({
      fullName: "",
      email: "",
      role: "",
      password: "",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          {isSignup ? "Create Account" : "Login"}
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          {isSignup
            ? "Fill the details to create a new account"
            : "Enter your email and password to login"}
        </p>

        {/* LOGIN FORM */}
        {!isSignup && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => {
                  setLoginData({ ...loginData, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-gray-700 font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={(e) => {
                  setLoginData({ ...loginData, password: e.target.value });
                  setErrors({ ...errors, password: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-12 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600 mt-3">
              Don’t have an account?{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  setIsSignup(true);
                  setErrors({});
                  setShowPasswordRegister(false);
                  setSignupData({
                    fullName: "",
                    email: "",
                    role: "",
                    password: "",
                  });
                }}
              >
                Sign Up
              </span>
            </p>
          </form>
        )}

        {/* SIGNUP FORM */}
        {isSignup && (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-gray-700 font-medium">Full Name</label>
              <input
                type="text"
                value={signupData.fullName}
                onChange={(e) => {
                  setSignupData({ ...signupData, fullName: e.target.value });
                  setErrors({ ...errors, fullName: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                placeholder="Enter name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => {
                  setSignupData({ ...signupData, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="text-gray-700 font-medium">Role</label>
              <select
                value={signupData.role}
                onChange={(e) => {
                  setSignupData({ ...signupData, role: e.target.value });
                  setErrors({ ...errors, role: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.role
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Worker">Worker</option>
                <option value="Reviewer">Reviewer</option>
              </select>

              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-gray-700 font-medium">Password</label>
              <input
                type={showPasswordRegister ? "text" : "password"}
                value={signupData.password}
                onChange={(e) => {
                  setSignupData({ ...signupData, password: e.target.value });
                  setErrors({ ...errors, password: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
                placeholder="Enter password"
              />
              <button
              type="button"
              onClick={() => setShowPasswordRegister(!showPasswordRegister)}
              className="absolute right-3 top-12 -translate-y-1/2 text-gray-600 hover:text-gray-900"
            >
              {showPasswordRegister ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-600 mt-3">
              Already have an account?{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  setIsSignup(false);
                  setErrors({});
                  setShowPassword(false);
                  setLoginData({
                    email: "",
                    password: "",
                  });
                }}
              >
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;