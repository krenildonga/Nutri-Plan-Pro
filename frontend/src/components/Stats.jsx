import React from 'react';
import { FaUserFriends, FaClipboardCheck, FaUtensils, FaDumbbell } from 'react-icons/fa';

const Stats = () => {
    const stats = [
        { label: "Active Members", value: "10K+", icon: <FaUserFriends /> },
        { label: "Macros Calculated", value: "2M+", icon: <FaClipboardCheck /> },
        { label: "Clean Meals Created", value: "500K+", icon: <FaUtensils /> },
        { label: "Success Rating", value: "98%", icon: <FaDumbbell /> }
    ];

    return (
        <section className="bg-slate-900 py-16">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                {stats.map((s, i) => (
                    <div key={i} className="space-y-4 group">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 mx-auto text-2xl group-hover:scale-110 transition-transform">
                            {s.icon}
                        </div>
                        <h4 className="text-4xl font-black text-white font-['Outfit'] tracking-tight">{s.value}</h4>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{s.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
