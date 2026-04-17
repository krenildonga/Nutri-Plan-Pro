import React from 'react';
import { FaMicrochip, FaChartPie, FaDatabase, FaShieldAlt } from 'react-icons/fa';

const Features = () => {
    const featureList = [
        {
            icon: <FaMicrochip />,
            title: "AI Diagnostics",
            desc: "Advanced metabolic modeling that understands your unique biometric signature.",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: <FaChartPie />,
            title: "Precision Macros",
            desc: "Mathematical accuracy for every gram of intake, tailored to your daily performance goals.",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            icon: <FaDatabase />,
            title: "Vault Archiving",
            desc: "Secure, encrypted cloud storage for your entire health and nutrition journey history.",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            icon: <FaShieldAlt />,
            title: "Elite Privacy",
            desc: "Enterprise-grade security ensuring your personal data remains yours and yours alone.",
            color: "text-rose-600",
            bg: "bg-rose-50"
        }
    ];

    return (
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featureList.map((f, i) => (
                    <div 
                        key={i} 
                        className="glass-card-premium p-8 rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500 animate-fadeIn"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        <div className={`w-16 h-16 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
                            {f.icon}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] mb-4 tracking-tight">
                            {f.title}
                        </h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
