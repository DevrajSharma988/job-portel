import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery, filters } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

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

                return locationMatch && industryMatch && employmentMatch && workModeMatch && salaryMatch;
            });
        }

        setFilterJobs(filteredJobs);
    }, [allJobs, searchedQuery, filters]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? (
                            <div className='flex-1 flex flex-col items-center justify-center py-20 text-center h-[88vh]'>
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">No jobs found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs