import React, { useContext, useEffect, useState } from 'react';
import './Diet_Rec.css';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

import {
    FaUserEdit, FaFire, FaBalanceScale, FaUtensils,
    FaDumbbell, FaChevronRight, FaHeartbeat, FaLeaf,
    FaCalendarCheck, FaChartLine
} from 'react-icons/fa';
import {
    MdOutlineMonitorWeight, MdOutlineHeight, MdSave,
    MdTrendingUp, MdHealthAndSafety
} from 'react-icons/md';

export const Diet_Rec = () => {
    const ConnString = import.meta.env.VITE_ConnString;
    const { isAuthenticate, user, setIsAuthenticate } = useContext(AuthContext);
    const [isGenerate, setIsGenerate] = useState(false);
    const exercises = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Elite Athlete']
    const [sliderValue, setSliderValue] = useState(0);
    const [exercise, setExercise] = useState();
    const [goal, setGoal] = useState("Loss Weight");
    const [mealValue, setMealValue] = useState(3);
    const [dietaryPreference, setDietaryPreference] = useState("Veg");

    const [personalData, setPersonalData] = useState({
        bmi: 0,
        bmr: 0,
        calories: 0,
        wStatus: 'Analyzing...',
        mealsperday: 3,
        goal: ''
    })
    const [recommendedMeals, setRecommandedMeal] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        setExercise(exercises[sliderValue]);
    }, [sliderValue]);


    useEffect(() => {
        try {
            const stored = localStorage.getItem('userData');
            if (stored) {
                const storedUser = JSON.parse(stored);
                if (storedUser && typeof storedUser === 'object') {
                    setAge(storedUser.age || 25);
                    setHeight(storedUser.height || 170);
                    setWeight(storedUser.weight || 70);
                    setGender(storedUser.gender || "male");
                    setDietaryPreference(storedUser.dietaryPreference || "Veg");
                }
            }
        } catch (e) {
            console.error("Local storage sync failed:", e);
            localStorage.removeItem('userData'); // Clear corrupted data
        }
    }, [])


    const [age, setAge] = useState(25);
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(70);
    const [gender, setGender] = useState("male");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticate) {
            toast.error("Please login or register to access the Health Command Center!");
            return;
        }

        const loadingToast = toast.loading("Processing Diagnostic Data...");
        try {
            const response = await fetch(`${ConnString}/auth/recommend-diet`, {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ age, height, weight, gender, phyAct: sliderValue, goal, meals_per_day: mealValue, dietaryPreference })
            });
            const json = await response.json();
            toast.dismiss(loadingToast);
            if (json.success) {
                console.log("DIAGNOSTIC JSON:", json);
                const calValues = Array.isArray(json.calvalues) ? json.calvalues : [0, 0, 0];
                setPersonalData({
                    bmi: parseFloat(calValues[0]) || 0,
                    bmr: parseFloat(calValues[1]) || 0,
                    calories: parseFloat(calValues[2]) || 0,
                    wStatus: String(json.wStatus || (Number(calValues[0] || 0) < 18.5 ? "Under Weight" : (calValues[0] || 0) > 25 ? "Above Range" : "Optimal Range")),
                    mealsperday: parseInt(json.mealsperday) || 3,
                    goal: json.goal || ''
                })

                const meals = Array.isArray(json.meals) ? json.meals : [];
                const initialSelectedMeals = Array.from({ length: json.mealsperday || 3 }, (_, i) => meals[i % meals.length] || ["Loading...", "", 0, 0, 0, 0]);
                setRecommandedMeal(meals)
                setSelectedMeals(initialSelectedMeals)

                setIsGenerate(true);
                toast.success("Health Analysis Complete!");
                setTimeout(() => {
                    document.getElementById('analysis-dashboard')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);


            } else {
                toast.error(json.error || "Failed to process data");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Diagnostic error. Please check your connection.");
        }
    }

    const [chartData, setChartData] = useState([0, 0, 0]);

    useEffect(() => {
        let newData = [0, 0, 0];
        if (Array.isArray(selectedMeals)) {
            selectedMeals.forEach(item => {
                if (Array.isArray(item)) {
                    newData[0] += (parseFloat(item[3]) || 0) * 9;
                    newData[1] += (parseFloat(item[4]) || 0) * 4;
                    newData[2] += (parseFloat(item[5]) || 0) * 4;
                }
            });
        }
        setChartData(newData.map(v => isNaN(v) ? 0 : parseFloat(v.toFixed(2))))
    }, [recommendedMeals, selectedMeals])


    const handleMealSelection = (e, index) => {
        const mealName = e.target.value;
        const meal = recommendedMeals.find(m => m[0] === mealName);
        if (meal) {
            const updated = [...selectedMeals];
            updated[index] = meal;
            setSelectedMeals(updated);
        }
    };


    const saveDiet = async () => {
        const loadingToast = toast.loading("Archiving Diet Plan...");
        try {
            const historyPayload = {
                personalData: {
                    age: parseInt(age),
                    height: parseInt(height),
                    weight: parseInt(weight),
                    gender: gender,
                    phyAct: parseInt(sliderValue),
                    goal: goal,
                    meals_per_day: parseInt(mealValue),
                    wStatus: personalData?.wStatus || 'Analyzing...',
                    bmi: parseFloat(personalData?.bmi) || 0,
                    bmr: parseFloat(personalData?.bmr) || 0,
                    required_calories: parseFloat(personalData?.calories) || 0
                },
                selectedMeals: selectedMeals.map(meal => ({
                    name: meal[0],
                    image: meal[1],
                    calories: parseFloat(meal[2]),
                    fat: parseFloat(meal[3]),
                    carbohydrates: parseFloat(meal[4]),
                    protein: parseFloat(meal[5])
                }))
            };

            const response = await fetch(`${ConnString}/auth/save-diet`, {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(historyPayload)
            });
            const json = await response.json();
            toast.dismiss(loadingToast);
            if (json.success) toast.success('Diet Plan Saved to History!');
            else toast.error(json.error);
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Cloud sync failed. Check your connection.");
        }
    }



    const calorieChart = {
        labels: ['Selected Intake', 'Daily Target'],
        datasets: [{
            data: [
                (chartData || [0, 0, 0]).reduce((a, b) => a + (parseFloat(b) || 0), 0),
                parseFloat(personalData?.calories) || 2000
            ],
            backgroundColor: ['#10b981', '#334155'],
            borderRadius: 12, borderSkipped: false,
        }]
    };

    const macroChart = {
        labels: ['Fat', 'Carbs', 'Protein'],
        datasets: [{
            data: (chartData || [0, 0, 0]).map(v => parseFloat(v) || 0),
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
            borderWidth: 0, hoverOffset: 20
        }]
    };

    // Component-level error boundary safety
    // Component-level safety check
    if (isGenerate && (!personalData || !personalData.bmi)) {
        return <div className="p-20 text-center text-slate-500 bg-premium min-h-screen font-black uppercase tracking-widest">Constructing Health Profile...</div>;
    }




    return (
        <div className="diet-rec-container bg-premium min-h-screen">
            <div className="max-w-[1400px] mx-auto px-6 py-8 md:py-16">

                {/* Elite Header */}
                <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 stagger-item stagger-1">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3 text-emerald-600 font-black tracking-[0.3em] uppercase text-xs">
                            <FaHeartbeat className="animate-pulse" />
                            <span>Precision Health Command</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-sans font-black text-slate-900 leading-tight">
                            Personalized <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Dietary Intelligence</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
                            AI-driven metabolic analysis for high-performance nutrition.
                        </p>
                    </div>

                    <nav className="flex items-center gap-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                        <Link to="/" className="hover:text-emerald-600 transition-all border-b-2 border-transparent hover:border-emerald-600 pb-1">Platform</Link>
                        <span className="text-slate-200">/</span>
                        <span className="text-emerald-700">Diagnostic</span>
                    </nav>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Consultation Sidebar */}
                    <aside className="lg:col-span-4 space-y-8 stagger-item stagger-2">
                        <div className="glass-card-premium rounded-[2.5rem] p-10 border border-emerald-100/50">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                    <FaUserEdit size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Metabolic Intake</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="group space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Current Age</label>
                                        <input type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} className="consultation-input" min={2} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Height (cm)</label>
                                            <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} className="consultation-input" min={50} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Weight (kg)</label>
                                            <input type="number" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} className="consultation-input" min={10} required />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Biometric Gender</label>
                                    <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                        {['male', 'female'].map(g => (
                                            <button
                                                key={g} type="button"
                                                onClick={() => setGender(g)}
                                                className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${gender === g ? 'bg-white text-emerald-700 shadow-md border border-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-black text-slate-800 uppercase tracking-widest">Physical Index</label>
                                        <span className="text-[10px] font-black text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">{exercise}</span>
                                    </div>
                                    <input type="range" min={0} max={4} value={sliderValue} onChange={(e) => setSliderValue(e.target.value)} className="range-slider-luxury w-full" />
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Lifestyle Goal</label>
                                        <select value={goal} onChange={(e) => setGoal(e.target.value)} className="consultation-input appearance-none bg-slate-50 cursor-pointer">
                                            <option value="Loss Weight">Rapid Weight Loss</option>
                                            <option value="Maintain Weight">Homeostasis (Maintain)</option>
                                            <option value="Gain Weight">Muscle Hypertrophy</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Meal Frequency</label>
                                            <span className="text-sm font-black text-emerald-600">{mealValue} Specialized Meals</span>
                                        </div>
                                        <input type="range" min={2} max={5} value={mealValue} onChange={(e) => setMealValue(e.target.value)} className="range-slider-luxury w-full" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Dietary Focus</label>
                                    <div className="flex gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                        {['Veg', 'Non-Veg'].map(p => (
                                            <button
                                                key={p} type="button"
                                                onClick={() => setDietaryPreference(p)}
                                                className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${dietaryPreference === p ? 'bg-white text-emerald-700 shadow-md border border-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-3xl shadow-2xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-4 group">
                                    <span className="tracking-[0.2em] uppercase text-sm">Initiate Analysis</span>
                                    <FaChartLine className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </aside>

                    {/* Results / Analysis Dashboard */}
                    <main className="lg:col-span-8 flex flex-col gap-12 stagger-item stagger-3">
                        {!isGenerate ? (
                            <div className="h-full min-h-[650px] glass-card-premium rounded-[3rem] border border-emerald-50/50 flex flex-col items-center justify-center text-center p-12 bg-white/60">
                                <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mb-8 animate-bounce transition-all duration-1000">
                                    <FaLeaf size={50} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Waiting for intake data...</h3>
                                <p className="text-slate-400 max-w-sm text-lg font-medium leading-relaxed">Complete your metabolic profile to unlock your high-performance dietary intelligence.</p>
                            </div>
                        ) : (
                            <div id="analysis-dashboard" className="space-y-12 animate-fadeIn">

                                {/* High-Impact Statistics */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="metric-card-glow glass-card-premium rounded-[2.5rem] p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="metric-icon-box bg-blue-100 text-blue-600">
                                                <FaBalanceScale />
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${personalData?.wStatus?.includes('Optimal') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                                                {personalData?.wStatus || "Analyzing..."}
                                            </span>

                                        </div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Body Mass Index</p>
                                        <h4 className="text-4xl font-black text-slate-900">{personalData?.bmi || 0} <span className="text-sm font-medium text-slate-400">pts</span></h4>
                                    </div>
                                    <div className="metric-card-glow glass-card-premium rounded-[2.5rem] p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="metric-icon-box bg-purple-100 text-purple-600 text-3xl">🫀</div>
                                            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">Basal Rate</span>
                                        </div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">BMR Forecast</p>
                                        <h4 className="text-4xl font-black text-slate-900">{personalData?.bmr || 0} <span className="text-sm font-medium text-slate-400">kcal</span></h4>
                                    </div>

                                    <div className="metric-card-glow glass-card-premium rounded-[2.5rem] p-8 bg-gradient-to-br from-white to-emerald-50/30">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="metric-icon-box bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                                                <FaFire />
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Daily Allocation</span>
                                                <span className="text-[9px] font-bold text-slate-400 italic">Precision Optimized</span>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Required Energy</p>
                                        <h4 className="text-4xl font-black text-emerald-700">{personalData?.calories || 0} <span className="text-sm font-medium text-emerald-400">kcal</span></h4>
                                    </div>

                                </div>

                                {/* Menu Selection (Primary Focus) */}
                                <div className="space-y-12 animate-fadeIn">
                                    <div className="glass-card-premium rounded-[3rem] p-10 border border-slate-100">
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Today's Menu</h3>
                                                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                    <FaCalendarCheck />
                                                    <span>Nutritional Routine</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {isAuthenticate && (
                                                    <button onClick={saveDiet} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-slate-900 text-white rounded-2xl transition-all shadow-xl shadow-emerald-100 group">
                                                        <MdSave className="group-hover:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Save to History</span>
                                                    </button>
                                                )}
                                                <Link to="/diet-history" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-xl shadow-slate-100 group">
                                                    <FaCalendarCheck className="group-hover:scale-110 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">View Archives</span>
                                                </Link>
                                            </div>

                                        </div>


                                        <div className="space-y-6">
                                            {Array.isArray(selectedMeals) && selectedMeals.map((meal, i) => (
                                                <div key={i} className="chef-menu-card flex flex-col sm:flex-row items-stretch gap-6 p-5 rounded-[2.5rem] bg-slate-50/50 hover:shadow-xl hover:shadow-emerald-50/50 transition-all">

                                                    <div className="chef-image-wrapper w-full sm:w-32 h-32 shrink-0">
                                                        <img src={meal?.[1] || ""} alt="Meal" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 w-full space-y-4 flex flex-col">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-wider mb-2 inline-block">Meal {i + 1}</span>
                                                                <h5 className="font-bold text-slate-900 text-lg truncate">{meal?.[0] || "Unnamed Recipe"}</h5>
                                                            </div>
                                                            <select
                                                                onChange={(e) => handleMealSelection(e, i)}
                                                                className="p-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-tighter outline-none cursor-pointer hover:border-emerald-400 transition-colors max-w-[120px]"
                                                            >
                                                                {Array.isArray(recommendedMeals) && recommendedMeals.map((m, mi) => (
                                                                    <option key={mi} value={m?.[0]}>{m?.[0]}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3 mt-auto pt-4">
                                                            <div className="luxury-label bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
                                                                <span className="text-[14px]">⚡</span>
                                                                <span>{Math.round(meal?.[2]) || 0} <span className="opacity-60 text-[8px]">kcal</span></span>
                                                            </div>
                                                            <div className="luxury-label bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                                                                <span>{parseFloat(meal?.[4] || 0).toFixed(1)} <span className="opacity-60 text-[8px]">carb</span></span>
                                                            </div>
                                                            <div className="luxury-label bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                                                <span>{parseFloat(meal?.[5] || 0).toFixed(1)} <span className="opacity-60 text-[8px]">prot</span></span>
                                                            </div>
                                                            <div className="luxury-label bg-amber-50 text-amber-600 border border-amber-100 shadow-sm">
                                                                <span>{parseFloat(meal?.[3] || 0).toFixed(1)} <span className="opacity-60 text-[8px]">fat</span></span>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    </div>

                                    {/* Data Visualization Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                                        {/* Energy Variance */}
                                        <div className="glass-card-premium rounded-[3rem] p-10 border border-slate-100 flex flex-col min-h-[400px]">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs">A/T</div>
                                                <h4 className="text-xl font-black text-slate-900 tracking-tight">Energy Variance</h4>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center min-h-[220px]">
                                                {calorieChart?.datasets?.[0]?.data && (
                                                    <Bar
                                                        data={calorieChart}
                                                        options={{
                                                            responsive: true,
                                                            plugins: { legend: { display: false } },
                                                            scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } } }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Macro Profile */}
                                        <div className="glass-card-premium rounded-[3rem] p-10 border border-slate-100 flex flex-col min-h-[400px]">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xs">M/D</div>
                                                <h4 className="text-xl font-black text-slate-900 tracking-tight">Macro Profile</h4>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center min-h-[220px]">
                                                {macroChart?.datasets?.[0]?.data && (
                                                    <Pie
                                                        data={macroChart}
                                                        options={{
                                                            plugins: {
                                                                legend: { position: 'bottom', labels: { usePointStyle: true, font: { weight: 'bold', size: 11 } } },
                                                                tooltip: { enabled: true }
                                                            },
                                                            maintainAspectRatio: false
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
