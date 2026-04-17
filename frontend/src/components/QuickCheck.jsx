import React, { useState, useEffect } from 'react';
import { FaFire, FaBolt, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const QuickCheck = () => {
    const [weight, setWeight] = useState(70);
    const [goal, setGoal] = useState('Maintain');
    const [estimate, setEstimate] = useState(2100);

    useEffect(() => {
        // Simplified BMR calculation for instant feedback teaser
        let base = weight * 24;
        let active = base * 1.35; // Standard active multiplier
        
        if (goal === 'Loss') active -= 500;
        else if (goal === 'Gain') active += 500;
        
        setEstimate(Math.round(active));
    }, [weight, goal]);

    return (
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-12">
            <div className="glass-card-premium rounded-[3rem] p-8 md:p-16 border border-emerald-100 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="flex-1 space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                        <FaBolt />
                        <span>Instant Insight</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                        Predict Your <span className="text-emerald-600">Daily Intake</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
                        Get a rapid metabolic estimate in seconds. This teaser uses simplified biometrics to demonstrate your potential calorie window.
                    </p>
                    
                    <div className="pt-4">
                        <Link 
                            to="/get-diet-recommendation" 
                            className="inline-flex items-center gap-3 bg-slate-900 text-white font-black px-10 py-5 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-95 group"
                        >
                            <span className="uppercase tracking-widest text-sm text-white">Unlock Full Diagnostics</span>
                            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="w-full lg:w-[450px] space-y-10 relative z-10">
                    <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-emerald-50">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Weight</label>
                                    <span className="text-sm font-black text-emerald-600">{weight} KG</span>
                                </div>
                                <input 
                                    type="range" min={40} max={150} value={weight} 
                                    onChange={(e) => setWeight(parseInt(e.target.value))} 
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Current Ambition</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Loss', 'Maintain', 'Gain'].map(g => (
                                        <button 
                                            key={g} 
                                            onClick={() => setGoal(g)}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${goal === g ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Predicted Target</p>
                                    <h4 className="text-4xl font-black text-slate-900 font-['Outfit'] mt-1">
                                        {estimate} <span className="text-xs font-medium text-slate-400">kcal</span>
                                    </h4>
                                </div>
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl animate-pulse">
                                    <FaFire />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuickCheck;
