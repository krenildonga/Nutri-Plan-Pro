import React from 'react';
import all_blogs from '../assets/all_blogs';
import BlogItem from './BlogItem';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const FeaturedBlogs = () => {
    // Only show the first 4 blogs as featured
    const featured = all_blogs.slice(0, 4);

    return (
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-24 bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                <div className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                        <span>Latest Intelligence</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                        Healthy <span className="text-emerald-600">Insights</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium">Expert guidance on high-performance nutrition and metabolic health habits.</p>
                </div>
                <Link to="/blogs" className="flex items-center gap-2 text-emerald-600 hover:text-slate-900 font-black uppercase tracking-widest text-sm transition-all group pb-2">
                    Explore Newsroom
                    <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featured.map((item) => (
                    <div className="animate-fadeIn" key={item.id}>
                        <BlogItem {...item} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedBlogs;
