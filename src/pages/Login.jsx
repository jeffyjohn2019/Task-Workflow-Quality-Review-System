import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaIdBadge, FaTasks } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
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
    username: "admin",
    password: "admin123",
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
    if (!loginData.username.trim()) {
      newErrors.username = "Username is required";
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
        (u.username === loginData.username || u.fullName === loginData.username || u.email === loginData.username) && u.password === loginData.password
    );

    if (!userFound) {
      toast.error("Invalid username or password");
      return;
    }

    dispatch(loginUser(userFound));
    localStorage.setItem("token", "mytoken123");
    toast.success("Successfully logged in ");
    setLoginData({
      username: "",
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

    const newUser = {
      fullName: signupData.fullName,
      email: signupData.email,
      role: signupData.role,
      password: signupData.password,
    };
    dispatch(registerUser(newUser));
    dispatch(loginUser(newUser));

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
    <div className="min-h-screen flex justify-center items-center bg-[#eaf1f8] px-4 font-sans relative overflow-hidden">
      {/* Decorative background glass elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[380px] bg-[#1a2b4cd9] bg-opacity-40 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(50,150,255,0.15)] rounded-3xl p-8 z-10 relative overflow-hidden text-white mx-auto">
        {/* Subtle glowing border accent */}
        <div className="absolute top-0 left-10 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <div className="absolute bottom-20 -left-[1px] w-[2px] h-20 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>

        {/* Top Icon */}
        <div className="flex justify-center mb-8">
          <div className="h-[88px] w-[88px] rounded-full border-[1.5px] border-cyan-400/80 flex justify-center items-center shadow-[inset_0_0_8px_rgba(34,211,238,0.3)]">
            <FaTasks className="text-cyan-400 text-3xl" />
          </div>
        </div>

        {/* LOGIN FORM */}
        {!isSignup && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <div className="relative flex items-center bg-white rounded-md overflow-hidden border border-gray-200 focus-within:border-blue-500 transition-all">
                <div className="px-4 text-gray-500">
                  <FaUser size={14} />
                </div>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => {
                    setLoginData({ ...loginData, username: e.target.value });
                    setErrors({ ...errors, username: "" });
                  }}
                  className="w-full py-[10px] text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none tracking-wide"
                  placeholder="Username"
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-sm mt-1 ml-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative flex items-center bg-white rounded-md overflow-hidden border border-gray-200 focus-within:border-blue-500 transition-all">
                <div className="px-4 text-gray-500">
                  <FaLock size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                  className="w-full py-[10px] text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none pr-10 tracking-[0.2em]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 hover:text-black transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 ml-1">{errors.password}</p>
              )}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-[#0d4f90] via-[#0b427b] to-[#042654] hover:from-[#115aa3] hover:to-[#073066] border border-[#1e6ac5]/40 text-white font-bold tracking-[0.1em] text-xs py-3 rounded-[4px] shadow-[0_4px_15px_rgba(13,79,144,0.3)] transition-all duration-300"
            >
              LOGIN
            </button>

            {/* Switch to Signup */}
            {/* <p className="text-center text-sm text-gray-400 mt-6 tracking-wide">
              Don’t have an account?{" "}
              <span
                className="text-cyan-400 font-semibold cursor-pointer hover:underline hover:text-cyan-300 transition-colors"
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
            </p> */}
          </form>
        )}

        {/* SIGNUP FORM */}
        {isSignup && (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="relative flex items-center bg-white rounded-md overflow-hidden border border-gray-200 focus-within:border-blue-500 transition-all">
                <div className="px-4 text-gray-500">
                  <FaUser size={14} />
                </div>
                <input
                  type="text"
                  value={signupData.fullName}
                  onChange={(e) => {
                    setSignupData({ ...signupData, fullName: e.target.value });
                    setErrors({ ...errors, fullName: "" });
                  }}
                  className="w-full py-[10px] text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none tracking-wide"
                  placeholder="Full Name"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1 ml-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative flex items-center bg-white rounded-md overflow-hidden border border-gray-200 focus-within:border-blue-500 transition-all">
                <div className="px-4 text-gray-500">
                  <FaEnvelope size={14} />
                </div>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => {
                    setSignupData({ ...signupData, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                  className="w-full py-[10px] text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none tracking-wide"
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <div className="relative flex items-center bg-white rounded-md overflow-hidden border border-gray-200 focus-within:border-blue-500 transition-all text-sm">
                <div className="px-4 text-gray-500">
                  <FaIdBadge size={14} />
                </div>
                <select
                  value={signupData.role}
                  onChange={(e) => {
                    setSignupData({ ...signupData, role: e.target.value });
                    setErrors({ ...errors, role: "" });
                  }}
                  className="w-full py-[10px] text-sm bg-transparent text-black focus:outline-none appearance-none"
                >
                  <option value="" className="bg-white text-gray-500">Select Role</option>
                  <option value="Admin" className="bg-white text-black">Admin</option>
                  <option value="Worker" className="bg-white text-black">Worker</option>
                  <option value="Reviewer" className="bg-white text-black">Reviewer</option>
                </select>
                {/* Custom dropdown arrow to match theme */}
                <div className="absolute right-4 pointer-events-none text-gray-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              {errors.role && (
                <p className="text-red-400 text-sm mt-1 ml-1">{errors.role}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative flex items-center bg-white rounded-md overflow-hidden border border-gray-200 focus-within:border-blue-500 transition-all">
                <div className="px-4 text-gray-500">
                  <FaLock size={14} />
                </div>
                <input
                  type={showPasswordRegister ? "text" : "password"}
                  value={signupData.password}
                  onChange={(e) => {
                    setSignupData({ ...signupData, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                  className="w-full py-[10px] text-sm bg-transparent text-black placeholder-gray-500 focus:outline-none pr-10 tracking-[0.2em]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordRegister(!showPasswordRegister)}
                  className="absolute right-4 text-gray-500 hover:text-black transition-colors"
                >
                  {showPasswordRegister ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-[#0d4f90] via-[#0b427b] to-[#042654] hover:from-[#115aa3] hover:to-[#073066] border border-[#1e6ac5]/40 text-white font-bold tracking-[0.1em] text-xs py-3 rounded-[4px] shadow-[0_4px_15px_rgba(13,79,144,0.3)] transition-all duration-300"
            >
              REGISTER
            </button>

            <p className="text-center text-sm text-gray-400 mt-6 tracking-wide">
              Already have an account?{" "}
              <span
                className="text-cyan-400 font-semibold cursor-pointer hover:underline hover:text-cyan-300 transition-colors"
                onClick={() => {
                  setIsSignup(false);
                  setErrors({});
                  setShowPassword(false);
                  setLoginData({
                    username: "",
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