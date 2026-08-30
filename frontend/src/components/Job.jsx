import React, { useState } from 'react'
import { Button } from './ui/button'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'
import { Users, Banknote, Clock, Laptop, Briefcase, GraduationCap } from 'lucide-react'
import { formatSalary } from '@/utils/constant'

const Job = ({job}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);

    const isSaved = user?.profile?.savedJobs?.includes(job?._id);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const days = Math.floor(timeDifference/(1000*24*60*60));
        return days < 0 ? 0 : days; // safeguard
    }
    
    const handleSaveJob = async () => {
        if (!user) {
            toast.error("Please login to save a job");
            return navigate("/login");
        }
        if (loading) return;
        
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/save/${job._id}`, {}, {
                withCredentials: true
            });
            
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='p-6 rounded-xl shadow-sm bg-white border border-slate-300 hover:shadow-md hover:border-slate-400 transition-all h-full flex flex-col justify-between'>
            <div>
                <div className='flex items-center justify-between mb-4'>
                    <p className='text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full'>
                        {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                    </p>
                </div>

                <div className='flex items-center gap-4 mb-4'>
                    <Button className="p-1 h-14 w-14 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" variant="outline" size="icon">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={job?.company?.logo} className="object-contain" />
                        </Avatar>
                    </Button>
                    <div>
                        <h1 className='font-semibold text-lg text-slate-900'>{job?.company?.name}</h1>
                        <p className='text-sm text-slate-500'>
                            {Array.isArray(job?.location) ? job.location.join(", ") : (job?.location || "Not specified")}
                        </p>
                    </div>
                </div>

                <div>
                    <h1 className='font-bold text-xl mb-2 text-slate-900'>{job?.title}</h1>
                    <p className='text-sm text-slate-600 line-clamp-3 leading-relaxed'>{job?.description}</p>
                </div>
            </div>
            
            <div className='mt-6'>
                <div className='flex flex-wrap items-center gap-2 mb-6'>
                    <Badge className='flex items-center text-blue-700 bg-blue-50 hover:bg-blue-100 border-transparent font-semibold py-1 px-3' variant="outline">
                        <Users size={14} className="mr-1.5" />
                        {job?.position > 0 ? `${job.position} Positions` : 'Multiple Positions'}
                    </Badge>
                    
                    {job?.employmentType && (
                        <Badge className='flex items-center text-purple-700 bg-purple-50 hover:bg-purple-100 border-transparent font-semibold py-1 px-3' variant="outline">
                            {job.employmentType.toLowerCase() === 'internship' ? <GraduationCap size={14} className="mr-1.5" /> : <Briefcase size={14} className="mr-1.5" />}
                            {job.employmentType}
                        </Badge>
                    )}
                    
                    {job?.workMode && (
                        <Badge className='flex items-center text-orange-700 bg-orange-50 hover:bg-orange-100 border-transparent font-semibold py-1 px-3' variant="outline">
                            <Laptop size={14} className="mr-1.5" />
                            {job.workMode}
                        </Badge>
                    )}

                    <Badge className='flex items-center text-slate-700 bg-slate-200 hover:bg-slate-300 border-transparent font-semibold py-1 px-3' variant="outline">
                        <Clock size={14} className="mr-1.5" />
                        {job?.jobType || 'Full-time'}
                    </Badge>

                    <Badge className='flex items-center text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-transparent font-semibold py-1 px-3' variant="outline">
                        <Banknote size={14} className="mr-1.5" />
                        {formatSalary(job)}
                    </Badge>
                </div>
                <div className='flex items-center gap-3'>
                    <Button 
                        onClick={()=> navigate(`/description/${job?._id}`)} 
                        variant="outline"
                        className="flex-1 bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                        Details
                    </Button>
                    <Button 
                        onClick={handleSaveJob} 
                        disabled={loading} 
                        className={`flex-1 font-medium transition-colors ${isSaved ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {isSaved ? 'Saved' : 'Save For Later'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Job