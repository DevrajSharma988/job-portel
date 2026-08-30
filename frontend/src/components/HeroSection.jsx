import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Briefcase, Building2, Users } from 'lucide-react';

const HeroSection = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { allJobs } = useSelector(store => store.job);

    return (
        <div className='relative overflow-hidden bg-gradient-to-b from-white to-[#EEF1F5] pt-20 pb-12 sm:pb-16 border-b border-slate-200'>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[700px] h-[700px] bg-sky-400 rounded-full blur-[130px] opacity-40 pointer-events-none"></div>
            <div className="absolute top-20 left-0 -ml-32 w-[600px] h-[600px] bg-blue-400 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-1/4 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[140px] opacity-30 pointer-events-none"></div>
            
            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                <div className='flex flex-col gap-6 items-center'>
                    {!user && (
                        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-blue-700 font-medium text-sm'>
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                            </span>
                            No. 1 Job Hunt Website
                        </div>
                    )}
                    
                    {user ? (
                        <h1 className='text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight'>
                            Welcome back, <br className="hidden sm:block" /> <span className='text-blue-700'>{user.fullname}</span>
                        </h1>
                    ) : (
                        <h1 className='text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight'>
                            Your Career Journey <br className="hidden sm:block" /> Starts <span className='text-blue-700'>Here</span>
                        </h1>
                    )}
                    
                    {user ? (
                        <p className='text-xl text-slate-600 mt-4 max-w-2xl mx-auto'>
                            Your dashboard is ready. Track your applications, manage your profile, and discover new opportunities matched just for you.
                        </p>
                    ) : (
                        <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of professionals finding their dream jobs. Build your profile, connect with top companies, and get hired faster.
                        </p>
                    )}

                    {!user && (
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                            <Button onClick={() => navigate("/explore")} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-xl shadow-md transition-all">
                                Explore Jobs
                            </Button>
                            <Button onClick={() => navigate("/login")} variant="outline" className="bg-white text-slate-700 px-8 py-6 text-lg rounded-xl shadow-sm hover:bg-slate-50 transition-all border-slate-200">
                                Post a Job
                            </Button>
                        </div>
                    )}
                </div>

                {/* Optional Stats for unregistered users to build trust */}
                {!user && (
                    <div className="mt-20 pt-10 border-t border-slate-200/60 flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-20 text-slate-500">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-blue-50 rounded-xl"><Briefcase className="w-6 h-6 text-blue-600" /></div>
                            <div className="text-3xl font-bold text-slate-900 mt-2">{allJobs?.length || 0}+</div>
                            <div className="text-sm font-medium uppercase tracking-wider text-slate-500">Active Jobs</div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-emerald-50 rounded-xl"><Building2 className="w-6 h-6 text-emerald-600" /></div>
                            <div className="text-3xl font-bold text-slate-900 mt-2">{new Set(allJobs?.filter(job => job?.company?._id).map(job => job.company._id)).size}+</div>
                            <div className="text-sm font-medium uppercase tracking-wider text-slate-500">Top Companies</div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-3 bg-indigo-50 rounded-xl"><Users className="w-6 h-6 text-indigo-600" /></div>
                            <div className="text-3xl font-bold text-slate-900 mt-2">{allJobs?.reduce((acc, job) => acc + (job.applications?.length || 0), 0)}+</div>
                            <div className="text-sm font-medium uppercase tracking-wider text-slate-500">Total Applicants</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeroSection