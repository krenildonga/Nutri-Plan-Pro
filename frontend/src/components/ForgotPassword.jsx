import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdCheckCircle } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: New Password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const ConnString = import.meta.env.VITE_ConnString || (import.meta.env.PROD ? "/api" : "http://localhost:8000");

    const handleIdentifyUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We still hit the forgot-password endpoint to verify if the email exists
            const response = await fetch(`${ConnString}/auth/forgot-password`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const json = await response.json();
            if (json.success) {
                // Email exists, proceed to set new password directly
                setStep(2);
            } else {
                toast.error(json.error || "User not found with this email");
            }
        } catch (err) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        setLoading(true);
        try {
            const response = await fetch(`${ConnString}/auth/reset-password`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const json = await response.json();
            if (json.success) {
                toast.success("Password updated successfully!");
                navigate('/login');
            } else {
                toast.error(json.error || "Failed to update password");
            }
        } catch (err) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50/30 p-6'>
            <div className='w-full max-w-md bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100/50 overflow-hidden p-8 md:p-12'>

                {/* Simplified Stepper Indicator */}
                <div className='flex items-center justify-center gap-4 mb-10'>
                    {[1, 2].map((s) => (
                        <div key={s} className='flex items-center'>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                {step > s ? <MdCheckCircle size={20} /> : s}
                            </div>
                            {s < 2 && <div className={`w-8 h-1 transition-all duration-300 ${step > s ? 'bg-emerald-600' : 'bg-slate-100'}`} />}
                        </div>
                    ))}
                </div>

                <div className='mb-8 text-center'>
                    <h1 className='text-3xl font-black text-slate-800 tracking-tight'>
                        {step === 1 && "Reset Password"}
                        {step === 2 && "Enter New Password"}
                    </h1>
                    <p className='text-slate-500 mt-2 text-sm'>
                        {step === 1 && "Enter your email to identify your account."}
                        {step === 2 && `Setting new password for ${email}`}
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleIdentifyUser} className='space-y-6'>
                        <div className='group relative'>
                            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                <MdEmail size={20} className='text-slate-400 group-focus-within:text-emerald-600 transition-colors' />
                            </div>
                            <input
                                type="email" required
                                className='block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all'
                                placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type='submit' disabled={loading} className='w-full py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 shadow-lg transition-all disabled:opacity-50'>
                            {loading ? "Identifying..." : "Identify Account"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className='space-y-6'>
                        <div className='group relative'>
                            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                <MdLock size={20} className='text-slate-400 group-focus-within:text-emerald-600 transition-colors' />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"} required
                                className='block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all'
                                placeholder='New Password' value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="button" className='absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400' onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                            </button>
                        </div>
                        <div className='group relative'>
                            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                <MdLock size={20} className='text-slate-400 group-focus-within:text-emerald-600 transition-colors' />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"} required
                                className='block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all'
                                placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type='submit' disabled={loading} className='w-full py-4 bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-800 shadow-lg transition-all disabled:opacity-50'>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                        <button type='button' onClick={() => setStep(1)} className='w-full text-sm text-slate-500 hover:text-emerald-700 transition-colors'>
                            Try a different email
                        </button>
                    </form>
                )}

                <div className='text-center pt-6'>
                    <p className='text-slate-500 text-sm'>
                        Back to <Link to="/login" className='text-emerald-700 font-bold hover:underline ml-1'>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
