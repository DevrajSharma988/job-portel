import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const trendingRoles = [
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "Graphic Designer",
    "FullStack Developer",
    "Product Manager"
];

const Explore = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [filteredJobs, setFilteredJobs] = useState(allJobs);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 9;

    useEffect(() => {
        setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }), 10);
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!query.trim()) {
            setFilteredJobs(allJobs);
            setCurrentPage(1);
            return;
        }
        
        const lowercaseQuery = query.toLowerCase();
        const filtered = allJobs.filter((job) => {
            const matchTitle = job.title?.toLowerCase().includes(lowercaseQuery);
            const matchDescription = job.description?.toLowerCase().includes(lowercaseQuery);
            const matchLocation = Array.isArray(job.location) 
                ? job.location.some(loc => loc.toLowerCase().includes(lowercaseQuery))
                : (job.location && job.location.toLowerCase().includes(lowercaseQuery));
            
            return matchTitle || matchDescription || matchLocation;
        });
        
        setFilteredJobs(filtered);
        setCurrentPage(1);
    }, [allJobs, query]);

    const categorySearchHandler = (role) => {
        setQuery(role);
    }

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    return (
        <div className="bg-[#EEF1F5] min-h-screen">
            <Navbar />
            
            {/* Hero Explore Section */}
            <div className="bg-gradient-to-b from-slate-100 to-[#EEF1F5] py-10 px-4 border-b border-slate-200">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Explore Your Next <span className="text-blue-700">Dream Role</span>
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Discover thousands of opportunities, from disruptive startups to industry giants.
                    </p>
                    
                    <div className="flex w-full shadow-sm border border-slate-300 pl-4 rounded-lg items-center gap-4 mx-auto bg-white overflow-hidden max-w-2xl mt-8 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
                        <Search className="text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Find your dream jobs by role, location, or keyword..."
                            onChange={(e) => setQuery(e.target.value)}
                            value={query}
                            className="outline-none border-none w-full py-3.5 text-slate-700 bg-transparent"
                        />
                        <Button className="rounded-none rounded-r-lg bg-slate-800 hover:bg-slate-700 h-full py-3.5 px-8 text-white font-semibold transition-all border-l border-slate-300">
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto my-10 px-4'>
                {/* Trending Roles */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        Trending Roles
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {trendingRoles.map((role, index) => (
                            <div 
                                key={index}
                                onClick={() => categorySearchHandler(role)}
                                className={`px-5 py-2.5 bg-white border ${query === role ? 'border-blue-500 shadow-sm bg-blue-50 text-blue-700 font-semibold' : 'border-slate-300 hover:border-blue-400 hover:shadow-sm text-slate-700'} transition-all rounded-lg cursor-pointer font-medium text-sm`}
                            >
                                {role}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured / Latest Jobs */}
                <div className="pb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">
                            {query ? `Search Results (${filteredJobs.length})` : `Featured Jobs (${filteredJobs.length})`}
                        </h2>
                    </div>
                    
                    {filteredJobs.length <= 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800">No jobs found</h3>
                            <p className="text-slate-500 mt-2">Try adjusting your search query or exploring different roles.</p>
                            <Button variant="outline" className="mt-6 border-slate-300" onClick={() => setQuery("")}>
                                Clear Search
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {
                                    currentJobs.map((job) => (
                                        <Job key={job._id} job={job}/>
                                    ))
                                }
                            </div>
                            
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-10 gap-3">
                                    <Button 
                                        variant="outline" 
                                        disabled={currentPage === 1} 
                                        onClick={() => {
                                            setCurrentPage(prev => Math.max(prev - 1, 1));
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                        Previous
                                    </Button>
                                    <span className="flex items-center px-4 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-md shadow-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button 
                                        variant="outline" 
                                        disabled={currentPage === totalPages} 
                                        onClick={() => {
                                            setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                        }}
                                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Explore
