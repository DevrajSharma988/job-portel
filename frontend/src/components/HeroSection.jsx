import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Briefcase, Building2, Users } from 'lucide-react';

const HeroSection = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    return (
        <div className='relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-12 sm:pb-16'>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                <div className='flex flex-col gap-6 items-center'>
                    {!user && (
                        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-[#F83002] font-medium text-sm animate-bounce-slow'>
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F83002] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F83002]"></span>
                            </span>
                            No. 1 Job Hunt Website
                        </div>
                    )}
                    
                    {user ? (
                        <h1 className='text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight'>
                            Welcome back, <br className="hidden sm:block" /> <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002]'>{user.fullname}</span>
                        </h1>
                    ) : (
                        <h1 className='text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight'>
                            Your Career Journey <br className="hidden sm:block" /> Starts <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002]'>Here</span>
                        </h1>
                    )}
                    
                    {user ? (
                        <p className='text-xl text-gray-600 mt-4 max-w-2xl mx-auto'>
                            Your dashboard is ready. Track your applications, manage your profile, and discover new opportunities matched just for you.
                        </p>
                    ) : (
                        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of professionals finding their dream jobs. Build your profile, connect with top companies, and get hired faster.
                        </p>
                    )}

                    {!user && (
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                            <Button onClick={() => navigate("/explore")} className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                Explore Jobs
                            </Button>
                            <Button onClick={() => navigate("/login")} variant="outline" className="bg-white text-gray-700 px-8 py-6 text-lg rounded-full shadow-sm hover:bg-gray-50 transition-all border-gray-200">
                                Post a Job
                            </Button>
                        </div>
                    )}
                </div>

                {/* Optional Stats for unregistered users to build trust */}
                {!user && (
                    <div className="mt-20 pt-10 border-t border-gray-200/60 flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-20 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                            <Briefcase className="w-8 h-8 text-indigo-500" />
                            <div className="text-3xl font-bold text-gray-900">10,000+</div>
                            <div className="text-sm font-medium uppercase tracking-wider">Active Jobs</div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Building2 className="w-8 h-8 text-purple-500" />
                            <div className="text-3xl font-bold text-gray-900">500+</div>
                            <div className="text-sm font-medium uppercase tracking-wider">Top Companies</div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Users className="w-8 h-8 text-[#F83002]" />
                            <div className="text-3xl font-bold text-gray-900">100k+</div>
                            <div className="text-sm font-medium uppercase tracking-wider">Hired Candidates</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeroSection