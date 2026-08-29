import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search, ArrowLeft } from 'lucide-react';
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

    useEffect(() => {
        // Use a small timeout to ensure it runs after render
        setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }), 10);
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!query.trim()) {
            setFilteredJobs(allJobs);
            return;
        }
        
        const lowercaseQuery = query.toLowerCase();
        const filtered = allJobs.filter((job) => {
            const matchTitle = job.title.toLowerCase().includes(lowercaseQuery);
            const matchDescription = job.description.toLowerCase().includes(lowercaseQuery);
            const matchLocation = Array.isArray(job.location) 
                ? job.location.some(loc => loc.toLowerCase().includes(lowercaseQuery))
                : (job.location && job.location.toLowerCase().includes(lowercaseQuery));
            
            return matchTitle || matchDescription || matchLocation;
        });
        
        setFilteredJobs(filtered);
    }, [allJobs, query]);

    const categorySearchHandler = (role) => {
        setQuery(role);
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto mt-4 px-4'>
                <Button onClick={() => navigate(-1)} variant="ghost" className="flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5"/>
                    Back
                </Button>
            </div>
            
            {/* Hero Explore Section */}
            <div className="bg-gradient-to-b from-[#6A38C2]/10 to-transparent py-10 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Explore Your Next <span className="text-[#6A38C2]">Dream Role</span>
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Discover thousands of opportunities, from disruptive startups to industry giants.
                    </p>
                    
                    <div className="flex w-full shadow-lg border border-gray-200 pl-4 rounded-full items-center gap-4 mx-auto bg-white overflow-hidden max-w-2xl mt-8 focus-within:ring-2 focus-within:ring-[#6A38C2]/50 transition-all">
                        <Search className="text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Find your dream jobs by role, location, or keyword..."
                            onChange={(e) => setQuery(e.target.value)}
                            value={query}
                            className="outline-none border-none w-full py-4 text-gray-700 bg-transparent"
                        />
                        <Button className="rounded-r-full bg-[#6A38C2] hover:bg-[#5b30a6] h-full py-4 px-8 text-white font-semibold transition-all">
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto my-12 px-4'>
                {/* Trending Roles */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        🔥 Trending Roles
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {trendingRoles.map((role, index) => (
                            <div 
                                key={index}
                                onClick={() => categorySearchHandler(role)}
                                className={`px-6 py-3 bg-white border ${query === role ? 'border-[#6A38C2] shadow-md bg-purple-50 text-[#6A38C2]' : 'border-gray-200 hover:border-[#6A38C2] hover:shadow-md text-gray-700'} hover:-translate-y-1 transition-all duration-300 rounded-full cursor-pointer font-medium text-sm text-center`}
                            >
                                {role}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured / Latest Jobs */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {query ? `Search Results (${filteredJobs.length})` : '✨ Featured Jobs'}
                        </h2>
                        {!query && (
                            <Button variant="outline" onClick={() => navigate("/jobs")} className="text-sm font-medium">
                                View All Jobs
                            </Button>
                        )}
                    </div>
                    
                    {filteredJobs.length <= 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">No jobs found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search query or exploring different roles.</p>
                            <Button variant="outline" className="mt-6" onClick={() => setQuery("")}>
                                Clear Search
                            </Button>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {
                                // If searching, show all matches. If empty, just show top 9 featured
                                (query ? filteredJobs : filteredJobs.slice(0, 9)).map((job) => (
                                    <Job key={job._id} job={job}/>
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Explore
