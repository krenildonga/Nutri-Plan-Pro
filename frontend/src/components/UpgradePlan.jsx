import React, { useState } from 'react';
import './UpgradePlan.css';
import { FaCheck, FaGem, FaCommentDots, FaImage, FaMicrochip, FaRobot, FaSearch, FaInfinity, FaMicrophone } from 'react-icons/fa';
import { FaLeaf, FaRocket, FaCrown, FaChartPie, FaHistory, FaCheckCircle, FaUserCheck, FaDumbbell } from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";

const UpgradePlan = () => {
    const [isBusiness, setIsBusiness] = useState(false);

    const plans = [
        {
            name: "Basic",
            price: "0",
            description: "The foundation for your health journey.",
            buttonText: "Current Plan",
            buttonStyle: "bg-slate-100 text-slate-400 cursor-default border border-slate-200",
            features: [
                { icon: <FaLeaf size={14} />, text: "Standard Metabolic Analysis" },
                { icon: <FaChartPie size={14} />, text: "Basic Macro Tracking" },
                { icon: <FaHistory size={14} />, text: "Recent 3-Record History" },
                { icon: <IoMdInformationCircleOutline size={14} />, text: "Community Access" },
            ]
        },
        {
            name: "Pro",
            price: "499",
            description: "Unleash your full metabolic potential.",
            buttonText: "Upgrade to Pro",
            buttonStyle: "bg-emerald-600 text-white hover:bg-emerald-700",
            highlighted: true,
            popular: true,
            features: [
                { icon: <FaRocket size={14} />, text: "Unlimited Diet Generations" },
                { icon: <FaCheckCircle size={14} />, text: "2-5 Meal Frequency Selection" },
                { icon: <FaHistory size={14} />, text: "Complete History Vault" },
                { icon: <FaDumbbell size={14} />, text: "Advanced Performance Analytics" },
                { icon: <FaChartPie size={14} />, text: "Energy Variance Dashboard" },
            ]
        },
        {
            name: "Elite",
            price: "999",
            description: "Elite coaching and precision modeling.",
            buttonText: "Get Elite Access",
            buttonStyle: "bg-slate-900 text-white hover:bg-black",
            featuresHeader: "Everything in Pro plus:",
            features: [
                { icon: <FaCrown size={14} />, text: "Priority AI Processing" },
                { icon: <FaUserCheck size={14} />, text: "Weekly Metabolic Reports" },
                { icon: <FaCheckCircle size={14} />, text: "Advanced Micronutrient Profiling" },
                { icon: <FaRocket size={14} />, text: "Early Access to New Features" },
            ]
        }
    ];

    return (
        <div className="upgrade-container py-20 px-4 md:px-10 lg:px-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-black text-emerald-900 text-center mb-10 tracking-tight">
                    Choose Your <span className="text-slate-900">Plan</span>
                </h1>

                {/* Toggle Container */}
                <div className="plan-toggle-container flex mb-16 shadow-sm">
                    <button 
                        className={`plan-toggle-btn ${!isBusiness ? 'active' : 'inactive'}`}
                        onClick={() => setIsBusiness(false)}
                    >
                        Monthly
                    </button>
                    <button 
                        className={`plan-toggle-btn ${isBusiness ? 'active' : 'inactive'}`}
                        onClick={() => setIsBusiness(true)}
                    >
                        Yearly (-20%)
                    </button>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {plans.map((plan, idx) => (
                        <div 
                            key={idx} 
                            className={`pricing-card rounded-[2.5rem] p-10 flex flex-col h-full animate-fadeIn ${plan.highlighted ? 'pricing-card-highlighted' : ''}`}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            {plan.popular && (
                                <div className="absolute top-6 right-8 px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full popular-badge">
                                    Most Popular
                                </div>
                            )}

                            <h2 className="text-3xl font-black text-slate-800 mb-6 font-['Outfit']">{plan.name}</h2>
                            
                            <div className="mb-4">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl md:text-5xl font-black text-slate-900">₹{isBusiness && plan.price !== "0" ? Math.round(plan.price.replace(',', '') * 0.8 * 12) : plan.price}</span>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">INR /</span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{isBusiness ? 'year' : 'month'}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-base text-slate-500 font-medium mb-10 leading-relaxed">
                                {plan.description}
                            </p>

                            <button className={`w-full py-4 rounded-2xl font-black text-sm mb-12 upgrade-btn shadow-lg transition-all ${plan.buttonStyle}`}>
                                {plan.buttonText}
                            </button>

                            <div className="space-y-6 mt-auto">
                                {plan.featuresHeader && (
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                                        {plan.featuresHeader}
                                    </p>
                                )}
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-start gap-3">
                                        <span className="feature-icon mt-1 text-emerald-600">{feature.icon}</span>
                                        <span className="text-sm text-slate-600 font-bold leading-tight">
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        Looking for more? <span className="text-emerald-700 font-bold cursor-pointer hover:underline">Contact our sales team</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradePlan;
