import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search } from 'lucide-react';

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    const [localQuery, setLocalQuery] = useState("");
    const [filteredJobs, setFilteredJobs] = useState(allJobs);

    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[dispatch])

    useEffect(() => {
        if (!localQuery.trim()) {
            setFilteredJobs(allJobs);
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
    }, [allJobs, localQuery]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className='font-bold text-2xl text-gray-900'>Browse Jobs ({filteredJobs.length})</h1>
                    <div className="flex w-full md:w-96 shadow-sm border border-gray-200 pl-4 rounded-full items-center gap-2 bg-white overflow-hidden">
                        <Search className="text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by role or location..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="outline-none border-none w-full py-2 text-gray-700 bg-transparent text-sm"
                        />
                    </div>
                </div>

                {filteredJobs.length <= 0 ? (
                    <div className='text-center my-20 bg-gray-50 py-16 rounded-2xl border border-dashed border-gray-200'>
                        <h2 className='text-2xl font-bold text-gray-700'>No Jobs Found</h2>
                        <p className='text-gray-500 mt-2'>Try adjusting your search query to find more jobs.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            filteredJobs.map((job) => {
                                return (
                                    <Job key={job._id} job={job}/>
                                )
                            })
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse