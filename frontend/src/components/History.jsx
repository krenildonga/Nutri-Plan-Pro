import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    FaTrash, FaEye, FaChevronDown, FaChevronUp, 
    FaHistory, FaBalanceScale, FaFire, FaUtensils,
    FaArrowLeft
} from 'react-icons/fa';
import { MdOutlineHistory } from 'react-icons/md';

const History = () => {
    const ConnString = import.meta.env.VITE_ConnString || (import.meta.env.PROD ? "/api" : "http://localhost:8000");
    const { isAuthenticate, user } = useContext(AuthContext);
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const response = await fetch(`${ConnString}/auth/gethistory`, {
                method: "GET",
                credentials: "include",
            });
            const json = await response.json();
            if (json.success) {
                setHistory(json.history);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHistory();
    }, [])

    const [expandedHistory, setExpandedHistory] = useState(null);

    const handleHistoryClick = (itemId) => {
        setExpandedHistory(expandedHistory === itemId ? null : itemId);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Prevent card expansion when clicking delete
        
        if (!window.confirm("Are you sure you want to permanently delete this dietary record?")) return;

        const loadingToast = toast.loading("Removing record...");
        try {
            const response = await fetch(`${ConnString}/auth/delete-history/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const json = await response.json();
            toast.dismiss(loadingToast);
            if (json.success) {
                toast.success("Record deleted successfully");
                setHistory(history.filter(item => item._id !== id));
                if (expandedHistory === id) setExpandedHistory(null);
            } else {
                toast.error(json.error || "Failed to delete record");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Network error. Please try again.");
        }
    };

    const formatDate = (createdAt) => {
        const date = new Date(createdAt);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
        });
    }

    const getMealData = (meal) => {
        if (!meal) return { name: "Unknown", image: "", calories: 0, carbohydrates: 0, protein: 0 };
        // If it's the new object format
        if (meal.name) return meal;
        // If it's the transition format (object with string keys "0", "1", etc.) or old array format
        return {
            name: meal.name || meal[0] || meal['0'] || "Unnamed Recipe",
            image: meal.image || meal[1] || meal['1'] || "/placeholder-meal.jpg",
            calories: meal.calories || meal[2] || meal['2'] || 0,
            carbohydrates: meal.carbohydrates || meal[4] || meal['4'] || 0,
            protein: meal.protein || meal[5] || meal['5'] || 0
        };
    };

    return (
        <div className="bg-premium min-h-screen py-12 px-6 md:px-12 lg:px-20 overflow-x-hidden">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 animate-fadeIn">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                            <FaHistory />
                            <span>Dietary Archives</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight font-['Outfit']">
                            Your <span className="text-emerald-600">Archive</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-xl">
                            Review and manage your personalized diet history and metabolic performance records.
                        </p>
                    </div>
                    
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold transition-all group">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                </header>

                {/* History List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Synchronizing Archives...</div>
                    ) : history.length > 0 ? (
                        history.map((item, index) => (
                            <div 
                                key={item._id} 
                                className={`glass-card-premium rounded-[2rem] overflow-hidden transition-all duration-500 animate-fadeIn ${expandedHistory === item._id ? 'ring-2 ring-emerald-500/20' : ''}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Card Header / Summary */}
                                <div 
                                    className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6"
                                    onClick={() => handleHistoryClick(item._id)}
                                >
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                            <FaUtensils size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{formatDate(item.createdAt)}</p>
                                            <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{getMealData(item.selectedMeals[0]).name} and more...</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                        <div className="hidden md:flex flex-col items-end px-6 border-r border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Intake</span>
                                            <span className="text-lg font-black text-slate-800">{item.personalData?.required_calories || 0} <span className="text-xs font-medium">kcal</span></span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <button 
                                                className={`p-3 rounded-xl transition-all flex items-center gap-2 font-bold text-sm ${expandedHistory === item._id ? 'bg-slate-900 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-sm'}`}
                                            >
                                                {expandedHistory === item._id ? <FaChevronUp /> : <><FaEye /> <span className="hidden sm:inline">View Analysis</span></>}
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(e, item._id)}
                                                className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                title="Delete Record"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Dashboard Detail */}
                                {expandedHistory === item._id && (
                                    <div className="px-6 pb-8 md:px-8 md:pb-10 animate-fadeIn">
                                        <div className="pt-8 border-t border-slate-100 space-y-10">
                                            
                                            {/* Diagnostic Stats */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-2">
                                                    <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">
                                                        <FaBalanceScale /> <span>Metabolic Index</span>
                                                    </div>
                                                    <h4 className="text-2xl font-black text-slate-800">{item.personalData?.bmi || "N/A"} <span className="text-xs font-normal text-slate-400">pts</span></h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.personalData?.wStatus || "Unknown"}</p>
                                                </div>

                                                <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-2">
                                                    <div className="flex items-center gap-2 text-purple-600 text-[10px] font-black uppercase tracking-widest mb-2">
                                                        <span>⚡</span> <span>Basal Forecast</span>
                                                    </div>
                                                    <h4 className="text-2xl font-black text-slate-800">{item.personalData?.bmr || 0} <span className="text-xs font-normal text-slate-400">kcal</span></h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Per 24h cycle</p>
                                                </div>

                                                <div className="p-6 bg-emerald-50/30 rounded-3xl border border-emerald-100 space-y-2">
                                                    <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-2">
                                                        <FaFire /> <span>Required Energy</span>
                                                    </div>
                                                    <h4 className="text-2xl font-black text-emerald-700">{item.personalData?.required_calories || 0} <span className="text-xs font-normal text-emerald-400">kcal</span></h4>
                                                    <p className="text-[10px] font-bold text-emerald-500 uppercase">{item.personalData?.goal || "N/A"}</p>
                                                </div>
                                            </div>

                                            {/* Meal Portfolio */}
                                            <div className="space-y-6">
                                                <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                                    <FaUtensils className="text-emerald-500" />
                                                    Archived Menu Plan
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {item.selectedMeals.map((rawMeal, i) => {
                                                        const meal = getMealData(rawMeal);
                                                        return (
                                                            <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-50 rounded-2xl hover:shadow-md transition-all group">
                                                                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                                                    <img src={meal.image || "/placeholder-meal.jpg"} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                </div>
                                                                <div className="flex-1 w-full overflow-hidden">
                                                                    <h5 className="font-bold text-slate-800 truncate">{meal.name}</h5>
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-rose-50 text-rose-600 rounded-lg">{Math.round(parseFloat(meal.calories) || 0)} kcal</span>
                                                                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">{parseFloat(meal.carbohydrates || 0).toFixed(1)}g carb</span>
                                                                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">{parseFloat(meal.protein || 0).toFixed(1)}g prot</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="glass-card-premium rounded-[3rem] p-20 text-center space-y-6 animate-fadeIn">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto">
                                <MdOutlineHistory size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Your archive is empty.</h2>
                            <p className="text-slate-400 max-w-sm mx-auto text-lg font-medium">Save your first diet recommendation to see it in your personalized archives.</p>
                            <Link 
                                to="/get-diet-recommendation" 
                                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-slate-900 transition-all active:scale-95 uppercase tracking-widest text-sm"
                            >
                                Start Analysis
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default History