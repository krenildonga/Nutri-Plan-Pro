import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className='bg-slate-950 text-slate-300 pt-20 pb-10'>
            <div className='max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
                    {/* Brand Section */}
                    <div className='space-y-6'>
                        <div className='flex items-center gap-3'>
                            <img src={logo} alt="Logo" className='w-12 h-12 rounded-xl shadow-lg shadow-emerald-500/20' />
                            <span className='font-bold text-2xl text-white tracking-tight'>NutriPlanPro</span>
                        </div>
                        <p className='text-slate-400 leading-relaxed max-w-xs'>
                            Empowering your health journey with precision nutrition and personalized diet plans tailored to your unique lifestyle.
                        </p>
                        <div className='flex gap-4'>
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, idx) => (
                                <a key={idx} href='#' className='p-2.5 bg-slate-900 rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-300'>
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className='text-white font-bold text-lg mb-6'>Quick Navigation</h4>
                        <ul className='space-y-4 font-medium'>
                            <li><Link to='/' className='hover:text-emerald-400 transition-colors flex items-center gap-2'><FaArrowRight size={10} className='opacity-50' />Home</Link></li>
                            <li><Link to='/get-diet-recommendation' className='hover:text-emerald-400 transition-colors flex items-center gap-2'><FaArrowRight size={10} className='opacity-50' />Get Diet</Link></li>
                            <li><Link to='/blogs' className='hover:text-emerald-400 transition-colors flex items-center gap-2'><FaArrowRight size={10} className='opacity-50' />Health Blogs</Link></li>
                            
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className='text-white font-bold text-lg mb-6'>Support & Help</h4>
                        <ul className='space-y-4 font-medium'>
                            <li><Link to='/contactUs' className='hover:text-emerald-400 transition-colors'>Contact Us</Link></li>
                            <li><a href='#' className='hover:text-emerald-400 transition-colors'>Privacy Policy</a></li>
                            <li><a href='#' className='hover:text-emerald-400 transition-colors'>Terms of Service</a></li>
                            <li><a href='#' className='hover:text-emerald-400 transition-colors'>FAQ</a></li>
                        </ul>
                    </div>

                    {/* Newsletter/Stay Updated */}
                    <div className='space-y-6'>
                        <h4 className='text-white font-bold text-lg mb-6'>Stay Updated</h4>
                        <p className='text-slate-400 text-sm'>Subscribe to get the latest nutrition tips and updates straight to your inbox.</p>
                        <div className='relative'>
                            <input 
                                type='email' 
                                placeholder='Email Address' 
                                className='w-full bg-slate-900 border border-slate-800 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-emerald-500 transition-colors'
                            />
                            <button className='absolute right-1.5 top-1.5 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-500 transition-colors'>
                                <FaArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className='pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4'>
                    <p className='text-sm text-slate-500'>
                        &copy; {new Date().getFullYear()} NutriPlanPro. All rights reserved.
                    </p>
                    <div className='flex gap-6 text-sm text-slate-500'>
                        <span className='hover:text-emerald-400 cursor-pointer transition-colors'>Made with ❤️ for Health</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
