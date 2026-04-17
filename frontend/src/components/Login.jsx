import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import login_img from '../assets/login.jpg';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const ConnString = import.meta.env.VITE_ConnString;
  const [inputUserData, setInputUserData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const {isAuthenticate,setIsAuthenticate,user,setUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${ConnString}/auth/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: inputUserData.email, password: inputUserData.password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      if (json.success) {
        setIsAuthenticate(true);
        json.userData.success = true;
        localStorage.setItem('userData', JSON.stringify(json.userData));
        localStorage.setItem('auth-token', JSON.stringify(json.auth_token));
        toast.success("Login successfully");
        navigate('/');
      }
      else {
        toast.error(json.error || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.message || "Failed to connect to server. Please try again later.");
    }
  }

  const handleChange = (e) => {
    setInputUserData({ ...inputUserData, [e.target.name]: e.target.value });
  }
  return (
    <div className='min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50/30 p-6'>
      <div className='w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100/50 overflow-hidden flex flex-col md:flex-row'>
        {/* Left Side: Illustration & Branding */}
        <div className='hidden md:flex md:w-1/2 bg-emerald-900 p-12 flex-col justify-between relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-emerald-700 rounded-full -ml-32 -mb-32 opacity-30 blur-3xl'></div>
          
          <div className='relative z-10'>
            <h2 className='text-4xl font-black text-white tracking-tight mb-4'>Welcome Back!</h2>
            <p className='text-emerald-100/80 text-lg leading-relaxed'>
              Login to continue your journey towards a healthier, more vibrant life with NutriPlanPro.
            </p>
          </div>

          <img 
            src={login_img} 
            className='relative z-10 object-contain w-full max-h-64 drop-shadow-2xl hover:scale-105 transition-transform duration-500' 
            alt="Login Illustration" 
          />

          <div className='relative z-10 text-emerald-200/60 text-sm'>
            &copy; {new Date().getFullYear()} NutriPlanPro. All rights reserved.
          </div>
        </div>
        
        {/* Right Side: Login Form */}
        <div className='flex-1 p-8 md:p-16 flex flex-col justify-center'>
          <div className='mb-10'>
            <h1 className='text-4xl font-black text-slate-800 tracking-tight'>Login</h1>
            <p className='text-slate-500 mt-2'>Welcome back, please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='group relative'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <MdEmail size={20} className='text-slate-400 group-focus-within:text-emerald-600 transition-colors' />
              </div>
              <input 
                id="email" name="email" type="email" required 
                className='block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all' 
                placeholder='Email Address' value={inputUserData.email} onChange={handleChange} 
              />
            </div>

            <div className='group relative'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <MdLock size={20} className='text-slate-400 group-focus-within:text-emerald-600 transition-colors' />
              </div>
              <input 
                id="password" name="password" type={showPassword ? "text" : "password"} required 
                className='block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all' 
                placeholder='Password' value={inputUserData.password} onChange={handleChange} 
              />
              <button
                type="button"
                className='absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
              </button>
            </div>

            <div className='flex items-center justify-between'>
              <label className='flex items-center gap-2 cursor-pointer group'>
                <input type="checkbox" className='w-4 h-4 rounded accent-emerald-600 cursor-pointer' />
                <span className='text-sm text-slate-600 group-hover:text-slate-800 transition-colors'>Remember me</span>
              </label>
              <Link to='/forgot-password' icon={false} className='text-sm font-semibold text-emerald-700 hover:text-emerald-600 hover:underline'>Forgot password?</Link>
            </div>

            <button type='submit' className='w-full py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 shadow-lg shadow-emerald-200/50 active:scale-[0.98] transition-all transform'>
              Login to Dashboard
            </button>

            <div className='text-center pt-6'>
              <p className='text-slate-500 text-sm'>
                Don't have an account? <Link to="/register" className='text-emerald-700 font-bold hover:underline ml-1'>Create one now</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login