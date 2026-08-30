import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Browse = () => {
    const navigate = useNavigate();
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    const [localQuery, setLocalQuery] = useState("");
    const [filteredJobs, setFilteredJobs] = useState(allJobs);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 9;

    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[dispatch])

    useEffect(() => {
        if (!localQuery.trim()) {
            setFilteredJobs(allJobs);
            setCurrentPage(1);
            return;
        }
        const query = localQuery.toLowerCase();
        const filtered = allJobs.filter((job) => {
            const matchTitle = job.title.toLowerCase().includes(query);
            const matchDescription = job.description.toLowerCase().includes(query);
            const matchLocation = Array.isArray(job.location) 
                ? job.location.some(loc => loc.toLowerCase().includes(query))
                : (job.location && job.location.toLowerCase().includes(query));
            
            return matchTitle || matchDescription || matchLocation;
        });
        setFilteredJobs(filtered);
        setCurrentPage(1);
    }, [allJobs, localQuery]);

    // Calculate pagination values
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    return (
        <div className="bg-[#EEF1F5] min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto mt-8 mb-10 px-4'>
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className='font-bold text-2xl text-slate-900'>Browse Jobs ({filteredJobs.length})</h1>
                    <div className="flex w-full md:w-96 border border-slate-300 pl-4 rounded-lg items-center gap-2 bg-white overflow-hidden shadow-sm">
                        <Search className="text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by role or location..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="outline-none border-none w-full py-2.5 text-slate-700 bg-transparent text-sm"
                        />
                    </div>
                </div>

                {filteredJobs.length <= 0 ? (
                    <div className='text-center my-20 bg-white py-16 rounded-xl border border-dashed border-slate-300'>
                        <h2 className='text-2xl font-bold text-slate-700'>No Jobs Found</h2>
                        <p className='text-slate-500 mt-2'>Try adjusting your search query to find more jobs.</p>
                    </div>
                ) : (
                    <div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                            {
                                currentJobs.map((job) => {
                                    return (
                                        <Job key={job._id} job={job}/>
                                    )
                                })
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
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse