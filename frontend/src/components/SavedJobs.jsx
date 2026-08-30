import React, { useEffect, useState, useMemo } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import { Bookmark, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const SavedJobs = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user?.role === 'recruiter') {
            navigate("/admin/dashboard");
        } else if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setSavedJobs(res.data.savedJobs);
                }
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message || "Failed to fetch saved jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchSavedJobs();
    }, []);

    const filteredSavedJobs = useMemo(() => {
        if (!searchQuery.trim()) return savedJobs;
        const query = searchQuery.toLowerCase();
        return savedJobs.filter((job) => {
            const matchTitle = job?.title?.toLowerCase().includes(query);
            const matchCompany = job?.company?.name?.toLowerCase().includes(query);
            const matchLocation = Array.isArray(job?.location) 
                ? job.location.some(loc => loc.toLowerCase().includes(query))
                : (job?.location && job.location.toLowerCase().includes(query));
            return matchTitle || matchCompany || matchLocation;
        });
    }, [savedJobs, searchQuery]);

    return (
        <div className="bg-[#EEF1F5] min-h-screen pb-20">
            <Navbar />
            <div className='max-w-6xl mx-auto mt-8 mb-10 px-4'>
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 text-blue-700 rounded-lg border border-blue-200">
                            <Bookmark className="w-7 h-7" fill="currentColor" />
                        </div>
                        <div>
                            <h1 className='font-bold text-3xl text-slate-900'>Saved Jobs</h1>
                            <p className='text-slate-500 mt-1'>Jobs you have saved for later</p>
                        </div>
                    </div>
                    {savedJobs.length > 0 && (
                        <div className="flex w-full md:w-96 border border-slate-300 pl-4 rounded-lg items-center gap-2 bg-white overflow-hidden shadow-sm">
                            <Search className="text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search saved jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="outline-none border-none w-full py-2.5 text-slate-700 bg-transparent text-sm"
                            />
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : savedJobs.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-sm border border-slate-200'>
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Bookmark className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800">No saved jobs yet</h3>
                        <p className="text-slate-500 mt-2">When you save jobs, they will appear here.</p>
                        <button 
                            onClick={() => navigate('/explore')}
                            className="mt-6 px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 font-medium"
                        >
                            Explore Jobs
                        </button>
                    </div>
                ) : filteredSavedJobs.length === 0 ? (
                    <div className='text-center my-20 bg-white py-16 rounded-xl border border-dashed border-slate-300'>
                        <h2 className='text-xl font-bold text-slate-700'>No jobs match your search</h2>
                        <p className='text-slate-500 mt-2'>Try adjusting your search query.</p>
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-4 px-4 py-2 text-blue-700 font-medium hover:bg-blue-50 rounded-md transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {filteredSavedJobs.map((job) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                key={job?._id}
                            >
                                <Job job={job} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
