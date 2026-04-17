import React, { useContext, useState } from 'react';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdLogin, MdLogout, MdRateReview } from "react-icons/md";
import { GrBlog, GrContactInfo } from "react-icons/gr";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import { FaGem } from "react-icons/fa";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Profile from './Profile';
import logo from '../assets/logo.png';

const Navbar = () => {
    const ConnString = import.meta.env.VITE_ConnString;
    const { isAuthenticate, setIsAuthenticate } = useContext(AuthContext);
    const [nav, setNav] = useState(false);
    const [menu, setMenu] = useState('home');
    const navigate = useNavigate();
    const location = useLocation();

    // Synchronize menu state with current URL path
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setMenu('home');
        else if (path.includes('/get-diet-recommendation')) setMenu('get_diet');
        else if (path.includes('/blogs')) setMenu('blogs');
        else if (path.includes('/contactUs')) setMenu('contact');
        else if (path.includes('/review')) setMenu('review');
        else if (path.includes('/diet-history')) setMenu('diet_history');
        else if (path.includes('/upgrade-plan')) setMenu('upgrade');
    }, [location.pathname]);


    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${ConnString}/auth/logout`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const json = await response.json();
            if (json.success) {
                setIsAuthenticate(false);
                localStorage.setItem('userData', JSON.stringify({ success: false }));
                localStorage.removeItem('auth-token');
                toast.success("Logout successfully");
                navigate('/');
            } else {
                toast.error(json.error);
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const goToLogin = () => {
        setIsAuthenticate(false);
        navigate('/login');
    };

    return (
        <div className='sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/50 shadow-sm transition-all duration-300'>
            <div className='max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 h-20 flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                    <div className='sm:hidden cursor-pointer p-2 hover:bg-slate-100 rounded-lg transition-colors' onClick={() => setNav(!nav)}>
                        <AiOutlineMenu size={24} className='text-slate-700' />
                    </div>
                    <Link to='/' className='flex items-center gap-2 group'>
                        <img src={logo} alt="NutriPlanPro Logo" className='w-10 h-10 object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform' />
                        <span className='font-bold text-xl lg:text-2xl tracking-tight text-emerald-900'>NutriPlanPro</span>
                    </Link>
                </div>

                <div className='hidden sm:block'>
                    <nav>
                        <ul className='flex items-center gap-1 lg:gap-2'>
                            {[
                                { id: 'home', label: 'Home', path: '/' },
                                { id: 'get_diet', label: 'Get Diet', path: '/get-diet-recommendation' },
                                { id: 'blogs', label: 'Blog', path: '/blogs' },
                                { id: 'contact', label: 'Contact', path: '/contactUs' },
                                { id: 'review', label: 'Review', path: '/review' }
                            ].map((item) => (
                                <Link key={item.id} to={item.path} onClick={() => setMenu(item.id)}>
                                    <li className={`px-4 py-2 rounded-full text-sm lg:text-base font-medium transition-all duration-200 cursor-pointer ${menu === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'}`}>
                                        {item.label}
                                    </li>
                                </Link>
                            ))}
                            {isAuthenticate && (
                                <>
                                    <Link to='/diet-history' onClick={() => setMenu('diet_history')}>
                                        <li className={`px-4 py-2 rounded-full text-sm lg:text-base font-medium transition-all duration-200 cursor-pointer ${menu === 'diet_history' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'}`}>
                                            History
                                        </li>
                                    </Link>
                                    <Link to='/upgrade-plan' onClick={() => setMenu('upgrade')}>
                                        <li className={`px-4 py-2 rounded-full text-sm lg:text-base font-medium transition-all duration-200 cursor-pointer ${menu === 'upgrade' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'}`}>
                                            Upgrade
                                        </li>
                                    </Link>

                                </>
                            )}
                        </ul>
                    </nav>
                </div>

                <div className='flex items-center gap-3'>
                    {!isAuthenticate ?
                        <button className='flex items-center gap-2 px-6 py-2.5 bg-emerald-700 text-white font-semibold rounded-full hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-200/50 active:scale-95 transition-all' onClick={goToLogin}>
                            <MdLogin size={20} />
                            <span>Login</span>
                        </button> :
                        <div className='flex items-center gap-4'>
                            <Profile />
                            <button className='hidden md:flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all' onClick={handleLogout}>
                                <MdLogout size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    }
                </div>
            </div>

            {/* mobile menu implementation */}
            <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 sm:hidden ${nav ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setNav(false)}>
                <div className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out ${nav ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
                    <div className='p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50'>
                        <div className='flex items-center gap-2'>
                            <img src={logo} className='w-8 h-8' alt="logo" />
                            <span className='font-bold text-xl text-emerald-900'>NutriPlanPro</span>
                        </div>
                        <button onClick={() => setNav(false)} className='p-2 hover:bg-slate-200 rounded-full transition-colors'>
                            <AiOutlineClose size={20} className='text-slate-600' />
                        </button>
                    </div>
                    <nav className='p-4'>
                        <ul className='space-y-1'>
                            {[
                                { id: 'home', label: 'Home', path: '/', icon: IoHomeOutline },
                                { id: 'get_diet', label: 'Get Diet', path: '/get-diet-recommendation', icon: BsFillInfoSquareFill },
                                { id: 'blogs', label: 'Blog', path: '/blogs', icon: GrBlog },
                                { id: 'contact', label: 'Contact', path: '/contactUs', icon: GrContactInfo },
                                { id: 'review', label: 'Review', path: '/review', icon: MdRateReview },
                                { id: 'upgrade', label: 'Upgrade Plan', path: '/upgrade-plan', icon: FaGem }
                            ].map((item) => (
                                <Link key={item.id} to={item.path} onClick={() => setNav(false)}>
                                    <li className='flex items-center gap-4 py-3 px-4 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all group font-medium'>
                                        {item.icon && <item.icon size={22} className='group-hover:scale-110 transition-transform' />}
                                        {item.label}
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Navbar