import React, { useContext, useState } from 'react'
import { FaCircleUser } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const [toggle, setToggle] = useState(false);
    const { user } = useContext(AuthContext);
    
    // Fallback if user context is empty/loading
    const displayName = user?.name || "User";
    const occupation = user?.occupation || "Member";

    return (
        <div className='relative'>
            <button 
                onClick={() => setToggle(!toggle)} 
                className='flex items-center justify-center p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none'
            >
                <FaCircleUser size={35} className='text-emerald-700' />
            </button>
            
            {toggle && (
                <>
                    <div className='fixed inset-0 z-10' onClick={() => setToggle(false)}></div>
                    <ul className='absolute right-0 mt-3 z-20 min-w-[220px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-in fade-in zoom-in duration-200'>
                        <li className='px-4 py-3 mb-2 bg-emerald-50 rounded-xl'>
                            <p className='font-bold text-slate-800 text-base leading-tight truncate'>
                                {displayName}
                            </p>
                            <p className='text-xs text-emerald-600 font-medium mt-1'>{occupation}</p>
                        </li>
                        <hr className='my-2 border-slate-100' />
                        <li>
                            <Link 
                                to='/editprofile' 
                                onClick={() => setToggle(false)}
                                className='block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700 rounded-lg transition-colors'
                            >
                                Edit Profile
                            </Link>
                        </li>
                    </ul>
                </>
            )}
        </div>
    )
}

export default Profile