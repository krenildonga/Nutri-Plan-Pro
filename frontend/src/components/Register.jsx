import React, { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast'
import { MdLock, MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaUser, FaBriefcase } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const ConnString = import.meta.env.VITE_ConnString || (import.meta.env.PROD ? "/api" : "http://localhost:8000");
  const [userData, setUserData] = useState({ name: "", email: "", password: "", age: "", height: "", weight: "", gender: "male", occupation: "Dietitians and Nutritionist", dietaryPreference: "Veg" });
  const [showPassword, setShowPassword] = useState(false);
  const {setIsAuthenticate} = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${ConnString}/auth/register`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: userData.name, email: userData.email, age: userData.age, height: userData.height, weight: userData.weight, gender: userData.gender, occupation: userData.occupation, password: userData.password, dietaryPreference: userData.dietaryPreference })
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
        toast.success("Registered successfully");
        navigate('/');
      }
      else {
        toast.error(json.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error(err.message || "Failed to connect to server. Please try again later.");
    }
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }
  return (
    <div className='min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50/30 p-6'>
      <div className='w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100/50 overflow-hidden flex flex-col md:flex-row'>
        <div className='hidden md:flex md:w-1/3 bg-emerald-900 p-10 flex-col justify-center text-white'>
          <h2 className='text-3xl font-bold mb-4'>Join Us</h2>
          <p className='text-emerald-100/80 text-sm leading-relaxed'>
            Start your personalized nutrition journey today.
          </p>
        </div>

        <div className='flex-1 p-8 md:p-12'>
          <div className='mb-8'>
            <h1 className='text-3xl font-black text-slate-800 tracking-tight'>Create Account</h1>
            <p className='text-slate-500 text-sm mt-2'>Personalize your experience</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='group relative'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <FaUser className='text-slate-400 group-focus-within:text-emerald-500 transition-colors' />
              </div>
              <input
                id="name" name="name" type="text"
                className='block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                placeholder='Full Name' value={userData.name} onChange={handleChange} required
              />
            </div>

            <div className='group relative'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <MdEmail className='text-slate-400 group-focus-within:text-emerald-500 transition-colors' />
              </div>
              <input
                id="email" name="email" type="email"
                className='block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                placeholder='Email Address' value={userData.email} onChange={handleChange} required
              />
            </div>

            <div className='flex gap-4'>
              <input
                id="age" name="age" type="number"
                className='block w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                placeholder='Age' value={userData.age} onChange={handleChange} required
              />
              <input
                id="height" name="height" type="number"
                className='block w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                placeholder='Height (cm)' value={userData.height} onChange={handleChange} required
              />
            </div>

            <div className='flex gap-4 items-center'>
              <input
                id="weight" name="weight" type="number"
                className='block w-1/2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                placeholder='Weight (kg)' value={userData.weight} onChange={handleChange} required
              />
              <div className='w-1/2 flex items-center gap-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type="radio" name="gender" className='accent-emerald-600' checked={userData.gender === 'male'} onChange={() => setUserData({ ...userData, gender: 'male' })} />
                  <span className='text-sm text-slate-600'>Male</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type="radio" name="gender" className='accent-emerald-600' checked={userData.gender === 'female'} onChange={() => setUserData({ ...userData, gender: 'female' })} />
                  <span className='text-sm text-slate-600'>Female</span>
                </label>
              </div>
            </div>

            <div className='group relative'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <FaBriefcase className='text-slate-400' />
              </div>
              <select
                id="occupation" name="occupation" onChange={handleChange}
                className='block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer'
              >
                <option value="Dietitians and Nutritionist">Dietitians and Nutritionist</option>
                <option value="Nutrition Coach">Nutrition Coach</option>
                <option value="Health Educator">Health Educator</option>
                <option value="Fitness Trainers and Instructor">Fitness Trainers and Instructor</option>
                <option value="Public Health Professional">Public Health Professional</option>
                <option value="Bussiness Man">Bussiness Man</option>
                <option value="Engineer">Engineer</option>
                <option value="Accountant">Accountant</option>
                <option value="Lawyer">Lawyer</option>
                <option value="Student">Student</option>
              </select>
            </div>

            <div className='group relative'>
              <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 ml-1'>Dietary Preference</label>
              <div className='flex items-center gap-6 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl mt-1'>
                <label className='flex items-center gap-2 cursor-pointer group/item'>
                  <input type="radio" name="dietaryPreference" className='accent-emerald-600 w-4 h-4' checked={userData.dietaryPreference === 'Veg'} onChange={() => setUserData({ ...userData, dietaryPreference: 'Veg' })} />
                  <span className='text-sm text-slate-600 font-medium group-hover/item:text-emerald-700 transition-colors'>Vegetarian</span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer group/item'>
                  <input type="radio" name="dietaryPreference" className='accent-emerald-600 w-4 h-4' checked={userData.dietaryPreference === 'Non-Veg'} onChange={() => setUserData({ ...userData, dietaryPreference: 'Non-Veg' })} />
                  <span className='text-sm text-slate-600 font-medium group-hover/item:text-emerald-700 transition-colors'>Non-Vegetarian</span>
                </label>
              </div>
            </div>

            <div className='group relative'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <MdLock size={18} className='text-slate-400 group-focus-within:text-emerald-500 transition-colors' />
              </div>
              <input
                id="password" name="password" type={showPassword ? "text" : "password"}
                className='block w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
                placeholder='Strong Password' value={userData.password} onChange={handleChange} required
              />
              <button
                type="button"
                className='absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>

            <button type='submit' className='w-full py-4 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all mt-4'>
              Create Account
            </button>

            <div className='text-center pt-4'>
              <p className='text-slate-500 text-sm'>
                Already have an account? <Link to="/login" className='text-emerald-700 font-bold hover:underline'>Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register