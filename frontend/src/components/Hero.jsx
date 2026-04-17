import React from 'react'
import hero_img from '../assets/hero1.png'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa6";
const Hero = () => {
    return (
        <div className='max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 py-10'>
            <div className='relative h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden rounded-[2rem] shadow-2xl shadow-emerald-100'>
                {/* Modern Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/40 to-transparent z-10 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24'>
                    <div className='max-w-2xl space-y-6'>
                        <div className='space-y-2'>
                            <p className='text-emerald-400 font-bold tracking-widest uppercase text-sm md:text-base mb-4'>Fuel Your Ambition</p>
                            <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight'>
                                Transform <br/><span className='text-emerald-400'>Your Plate</span>
                            </h1>
                            <h2 className='text-2xl sm:text-3xl md:text-4xl font-medium text-slate-100 opacity-90'>
                                Transform Your Life.
                            </h2>
                        </div>
                        
                        <div className='pt-6'>
                            <Link to='/get-diet-recommendation' className='group inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300'>
                                <span className='text-lg md:text-xl'>GET STARTED</span>
                                <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <img 
                    className='w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-1000' 
                    src={hero_img} 
                    alt="Healthy Diet" 
                />
            </div>
        </div>
    )
}

export default Hero