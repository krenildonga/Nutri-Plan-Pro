import React, { useEffect } from 'react';
import Hero from './Hero';
import FAQ from './FAQ';
import Features from './Features';
import QuickCheck from './QuickCheck';
import Stats from './Stats';
import FeaturedBlogs from './FeaturedBlogs';

const Home = () => {
    return (
        <div className='bg-premium overflow-hidden'>
            <Hero />
            <div className="py-20">
                <QuickCheck />
            </div>
            <div className="bg-white/30 backdrop-blur-3xl border-y border-emerald-100/50">
                <Features />
            </div>
            <FeaturedBlogs />
            <Stats />
            <div className="py-24 bg-slate-50/50">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <FAQ />
                </div>
            </div>
        </div>
    );
};

export default Home;