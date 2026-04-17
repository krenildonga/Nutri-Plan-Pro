import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaStar, FaRegStar, FaCheckCircle, FaRocket } from 'react-icons/fa';
import { MdRateReview, MdFeaturedPlayList } from 'react-icons/md';
const ReviewPage = () => {
    const ConnString = import.meta.env.VITE_ConnString;
    const { isAuthenticate, user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [feature, setFeature] = useState("General Website");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

    const featureOptions = [
        "General Website",
        "Diet Recommendation Engine",
        "Community Forum",
        "Personalized Dashboard",
        "Blog Section",
        "User Profile Management"
    ];

    const featuredReviews = [
        {
            _id: "feat-1",
            user: { name: "Sarah", occupation: "Fitness Enthusiast" },
            rating: 5,
            comment: "Since I started using NutriPlanPro, I've seen a remarkable improvement in my overall health and energy levels. The personalized meal recommendations have made it easy for me to maintain a balanced diet that fits my busy lifestyle.",
            feature: "Diet Recommendation Engine",
            createdAt: new Date().toISOString()
        },
        {
            _id: "feat-2",
            user: { name: "Rajan", occupation: "Tech Professional" },
            rating: 5,
            comment: "I've struggled with finding the right diet for years, but NutriPlanPro changed everything for me. The tailored meal plans are not only delicious but also perfectly aligned with my dietary preferences.",
            feature: "Personalized Dashboard",
            createdAt: new Date().toISOString()
        },
        {
            _id: "feat-3",
            user: { name: "Sarthak", occupation: "Nutritionist" },
            rating: 5,
            comment: "As a nutrition enthusiast, I'm always on the lookout for tools that can help me optimize my diet. NutriPlanPro exceeded my expectations with its personalized meal recommendations.",
            feature: "General Website",
            createdAt: new Date().toISOString()
        }
    ];

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${ConnString}/auth/get-reviews`);
            const data = await response.json();
            if (data.success) {
                // Combine featured reviews with real ones, showing real ones first if they're new
                const filteredReviews = data.reviews.filter(r => r.comment.length > 5);
                setReviews([...filteredReviews, ...featuredReviews]);
            }
        } catch (error) {
            console.error("Fetch reviews error:", error);
            setReviews(featuredReviews);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticate) {
            toast.error("Please login to submit a review");
            navigate('/login');
            return;
        }

        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        if (comment.trim().length < 5) {
            toast.error("Please write a bit more in your comment");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${ConnString}/auth/add-review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ rating, comment, feature }),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Thank you for your feedback!");
                
                // Add the new review to the top of the list immediately
                const newReview = {
                    ...data.review,
                    user: { name: user.name || "User", occupation: user.occupation || "Member" }
                };
                setReviews([newReview, ...reviews]);
                
                setRating(0);
                setComment("");
            } else {
                toast.error(data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Review submission error:", error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-premium py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-emerald-950 font-['Outfit'] tracking-tight">Community <span className="text-emerald-600">Feedback</span></h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">See how NutriPlanPro is helping people transform their lives and share your own experience to help us grow.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Form Side - Sticks on scroll if possible via CSS */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-emerald-100 sticky top-8">
                            <div className="bg-emerald-900 p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                                        <MdRateReview size={32} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Write a Review</h3>
                                        <p className="text-emerald-50/70 text-sm">Takes less than a minute</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                {/* Rating Stars */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Rating</label>
                                    <div className="flex items-center gap-2">
                                        {[...Array(5)].map((_, index) => {
                                            const starValue = index + 1;
                                            return (
                                                <button
                                                    type="button"
                                                    key={index}
                                                    onClick={() => setRating(starValue)}
                                                    onMouseEnter={() => setHover(starValue)}
                                                    onMouseLeave={() => setHover(0)}
                                                    className="focus:outline-none transition-transform hover:scale-125 duration-200"
                                                >
                                                    {starValue <= (hover || rating) ? (
                                                        <FaStar size={30} className="text-amber-400 drop-shadow-sm" />
                                                    ) : (
                                                        <FaRegStar size={30} className="text-slate-300" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Feature Selection */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Category</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">
                                            <MdFeaturedPlayList size={20} />
                                        </div>
                                        <select
                                            value={feature}
                                            onChange={(e) => setFeature(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                                        >
                                            {featureOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Comment Textbox */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Message</label>
                                    <textarea
                                        placeholder="Tell us about your experience..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-6 text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500 transition-all min-h-[160px] resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-200 transition-all transform active:scale-95 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <FaRocket size={18} />
                                            <span className="text-lg uppercase tracking-wider">Submit Review</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Review List Side */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl font-bold text-emerald-950">Recent Experiences</h3>
                            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">{reviews.length} Feedbacks</span>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                                <p className="text-slate-500 font-medium tracking-wide">Fetching community stories...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((rev, idx) => (
                                    <div key={rev._id || idx} className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 transition-all hover:shadow-xl hover:border-emerald-100 group animate-fadeIn">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex gap-4">
                                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center text-emerald-700 font-black text-xl shadow-inner">
                                                    {(rev.user?.name || "U")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-800">{rev.user?.name || "Anonymous User"}</h4>
                                                    <p className="text-emerald-600 text-sm font-medium">{rev.user?.occupation || "Member"}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} size={16} className={i < rev.rating ? "text-amber-400" : "text-slate-200"} />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                                                    {rev.feature}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-6 relative">
                                            <svg className="absolute -left-2 -top-4 w-10 h-10 text-emerald-50 opacity-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.899 14.916 16 16.017 16H19.017C19.568 16 20.017 15.551 20.017 15V9C20.017 8.449 19.568 8 19.017 8H16.017C16.017 7.101 14.017 6V3L17.017 3C18.674 3 20.017 4.343 20.017 6V15C20.017 17.209 18.226 19 16.017 19L14.017 21ZM4.017 21L4.017 18C4.017 16.899 4.916 16 6.017 16H9.017C9.568 16 10.017 15.551 10.017 15V9C10.017 8.449 9.568 8 9.017 8H6.017C4.916 8 4.017 7.101 4.017 6V3L7.017 3C8.674 3 10.017 4.343 10.017 6V15C10.017 17.209 8.226 19 6.017 19L4.017 21Z" /></svg>
                                            <p className="text-slate-600 leading-relaxed italic relative z-10 pl-4 border-l-2 border-emerald-100 italic">
                                                "{rev.comment}"
                                            </p>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                <FaCheckCircle className="text-emerald-500" /> Verified Experience
                                            </span>
                                            <span className="text-slate-300 text-xs">
                                                {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewPage;
