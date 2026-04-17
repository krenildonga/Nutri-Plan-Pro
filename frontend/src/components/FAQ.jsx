import React from 'react'
import faqData from '../assets/FAQ'
import { FaQuestionCircle, FaChevronDown } from 'react-icons/fa'

const FAQ = () => {
    return (
        <section className="py-12 px-6 md:px-12 lg:px-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fadeIn">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 backdrop-blur-md text-emerald-700 text-xs font-bold mb-6 tracking-[0.2em] uppercase border border-emerald-200/50">
                        <FaQuestionCircle size={14} />
                        <span>Support Center</span>
                    </div>
                    
                    <div className="relative inline-block mb-6">
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter font-['Outfit'] relative z-10 px-4">
                            Frequently Asked <span className="text-emerald-600 relative inline-block">
                                Questions
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400 opacity-30" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0 10 Q 25 20, 50 10 T 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
                                </svg>
                            </span>
                        </h2>
                    </div>
                    
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-['Inter'] leading-relaxed">
                        Find quick answers to our most popular inquiries about personalized nutrition and platform features.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <details 
                            key={index} 
                            className="group glass-card-premium rounded-3xl overflow-hidden transition-all duration-300 open:shadow-xl open:shadow-emerald-500/5 animate-fadeIn"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <summary className="flex items-center justify-between p-6 md:p-8 cursor-pointer list-none">
                                <h3 className="text-lg md:text-xl font-bold text-slate-800 transition-colors group-hover:text-emerald-600 font-['Outfit'] pr-8">
                                    {faq.question}
                                </h3>
                                <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-300 group-open:rotate-180 group-open:bg-emerald-600 group-open:text-white">
                                    <FaChevronDown size={14} className="transition-transform duration-300" />
                                </div>
                            </summary>
                            <div className="px-6 pb-6 md:px-8 md:pb-8">
                                <div className="pt-2 border-t border-slate-100 font-['Inter']">
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                    <p className="text-slate-500 font-medium">
                        Still have questions? <a href="/contactUs" className="text-emerald-600 font-bold hover:underline">Contact our support team</a>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default FAQ