import React from 'react';
import { Link } from 'react-router-dom';

const BlogItem = (props) => {
    return (
        <div className="group">
            <article className="glass-card-premium overflow-hidden rounded-[2rem] border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-2 h-full flex flex-col">
                <div className="h-56 w-full overflow-hidden">
                    <img
                        alt={props.title}
                        src={props.img}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">{props.date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-3 leading-tight group-hover:text-emerald-700 transition-colors">
                        {props.title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                        {props.description}
                    </p>

                    <Link 
                        to={`/blog_post/${props.id}`} 
                        onClick={() => window.scrollTo({top:0, behavior:"smooth"})} 
                        className="inline-flex items-center gap-2 text-sm font-black text-emerald-600 uppercase tracking-widest hover:text-slate-900 transition-all"
                    >
                        <span>Analyze Report</span>
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </Link>
                </div>
            </article>
        </div>
    )
}

export default BlogItem