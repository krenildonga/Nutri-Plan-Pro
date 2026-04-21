import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff
} from "react-icons/md";

import login_img from '../assets/login.jpg';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  // FINAL SAFE API URL
  const ConnString = import.meta.env.PROD
    ? "/api"
    : "http://localhost:8000";

  const [inputUserData, setInputUserData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const { setIsAuthenticate } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ConnString}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: inputUserData.email,
          password: inputUserData.password
        })
      });

      const text = await response.text();

      let json = {};

      try {
        json = text ? JSON.parse(text) : {};
      } catch (error) {
        throw new Error("Invalid server response.");
      }

      if (!response.ok) {
        throw new Error(
          json.error ||
          json.message ||
          `HTTP error! status: ${response.status}`
        );
      }

      if (json.success) {
        setIsAuthenticate(true);

        localStorage.setItem(
          "userData",
          JSON.stringify(json.userData || {})
        );

        localStorage.setItem(
          "auth-token",
          JSON.stringify(json.auth_token || "")
        );

        toast.success("Login successfully");
        navigate("/");
      } else {
        toast.error(json.error || "Login failed");
      }

    } catch (err) {
      console.error("Login Error:", err);
      toast.error(
        err.message || "Failed to connect to server."
      );
    }
  };

  const handleChange = (e) => {
    setInputUserData({
      ...inputUserData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className='min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50/30 p-6'>
      <div className='w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden flex flex-col md:flex-row'>

        {/* Left */}
        <div className='hidden md:flex md:w-1/2 bg-emerald-900 p-12 flex-col justify-between relative'>
          <div>
            <h2 className='text-4xl font-black text-white mb-4'>
              Welcome Back!
            </h2>

            <p className='text-emerald-100 text-lg leading-relaxed'>
              Login to continue your journey towards a healthier,
              more vibrant life with NutriPlanPro.
            </p>
          </div>

          <img
            src={login_img}
            alt="Login"
            className='object-contain w-full max-h-64'
          />

          <div className='text-emerald-200 text-sm'>
            &copy; {new Date().getFullYear()} NutriPlanPro
          </div>
        </div>

        {/* Right */}
        <div className='flex-1 p-8 md:p-16 flex flex-col justify-center'>
          <div className='mb-10'>
            <h1 className='text-4xl font-black text-slate-800'>
              Login
            </h1>

            <p className='text-slate-500 mt-2'>
              Welcome back, please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>

            {/* Email */}
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center'>
                <MdEmail size={20} className='text-slate-400' />
              </div>

              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                value={inputUserData.email}
                onChange={handleChange}
                className='w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl'
              />
            </div>

            {/* Password */}
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center'>
                <MdLock size={20} className='text-slate-400' />
              </div>

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={inputUserData.password}
                onChange={handleChange}
                className='w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl'
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400'
              >
                {showPassword
                  ? <MdVisibilityOff size={22} />
                  : <MdVisibility size={22} />
                }
              </button>
            </div>

            {/* Row */}
            <div className='flex justify-between items-center'>
              <label className='flex gap-2 items-center text-sm text-slate-600'>
                <input type="checkbox" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className='text-sm font-semibold text-emerald-700'
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className='w-full py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800'
            >
              Login to Dashboard
            </button>

            {/* Register */}
            <div className='text-center pt-4'>
              <p className='text-sm text-slate-500'>
                Don't have an account?

                <Link
                  to="/register"
                  className='ml-1 text-emerald-700 font-bold'
                >
                  Create one now
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;