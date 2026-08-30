import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

const Jobs = () => {
    const { allJobs, searchedQuery, filters } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 9;

    useEffect(() => {
        setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }), 10);
    }, []);

    useEffect(() => {
        let filteredJobs = [...allJobs];

        if (searchedQuery) {
            const query = searchedQuery.toLowerCase();
            filteredJobs = filteredJobs.filter((job) => {
                const matchTitle = job.title.toLowerCase().includes(query);
                const matchDescription = job.description.toLowerCase().includes(query);
                const matchLocation = Array.isArray(job.location) 
                    ? job.location.some(loc => loc.toLowerCase().includes(query))
                    : (job.location && job.location.toLowerCase().includes(query));
                
                return matchTitle || matchDescription || matchLocation;
            })
        }

        if (filters) {
            filteredJobs = filteredJobs.filter(job => {
                const locationMatch = !filters.locations || filters.locations.length === 0 || 
                    (Array.isArray(job.location) 
                        ? job.location.some(loc => filters.locations.includes(loc)) 
                        : filters.locations.includes(job.location));

                const industryMatch = !filters.industries || filters.industries.length === 0 ||
                    filters.industries.some(ind => job.title.toLowerCase().includes(ind.toLowerCase()));

                const employmentMatch = !filters.employmentTypes || filters.employmentTypes.length === 0 ||
                    filters.employmentTypes.includes(job.employmentType);

                const jobTypeMatch = !filters.jobTypes || filters.jobTypes.length === 0 ||
                    filters.jobTypes.includes(job.jobType);

                const workModeMatch = !filters.workModes || filters.workModes.length === 0 ||
                    filters.workModes.includes(job.workMode);

                const salaryMatch = !filters.salaryRanges || filters.salaryRanges.length === 0 ||
                    filters.salaryRanges.some(range => {
                        const s = job.salary;
                        if (range === "0-3 LPA") return s >= 0 && s <= 3;
                        if (range === "3-5 LPA") return s > 3 && s <= 5;
                        if (range === "5-10 LPA") return s > 5 && s <= 10;
                        if (range === "10+ LPA") return s > 10;
                        return true;
                    });

                return locationMatch && industryMatch && employmentMatch && jobTypeMatch && workModeMatch && salaryMatch;
            });
        }

        setFilterJobs(filteredJobs);
        setCurrentPage(1);
    }, [allJobs, searchedQuery, filters]);

    // Calculate pagination values
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filterJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filterJobs.length / jobsPerPage);

    return (
        <div className="bg-[#EEF1F5] h-screen overflow-hidden flex flex-col">
            <Navbar />
            <div className='flex flex-1 overflow-hidden'>
                {/* Sidebar - Full height, attached to left */}
                <aside className='hidden lg:block w-[280px] min-w-[280px] bg-[#F7F8FA] border-r border-slate-300 h-full overflow-y-auto custom-scrollbar'>
                    <div className="p-4">
                        <FilterCard />
                    </div>
                </aside>
                
                {/* Main Content Area */}
                <main className='flex-1 h-full overflow-y-auto custom-scrollbar p-6'>
                    {/* Mobile filter toggle */}
                    <div className='lg:hidden mb-4'>
                        <FilterCard />
                    </div>

                    {filterJobs.length <= 0 ? (
                        <div className='flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-slate-200 shadow-sm'>
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800">No jobs found</h3>
                            <p className="text-slate-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div>
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                                {
                                    currentJobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            key={job?._id}>
                                            <Job job={job} />
                                        </motion.div>
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
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
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
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Jobs