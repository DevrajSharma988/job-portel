import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, formatSalary, formatExperience } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Building2, MapPin, Briefcase, IndianRupee, Users, Clock, CalendarDays, Laptop, GraduationCap, Banknote } from 'lucide-react';
import Navbar from './shared/Navbar';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to apply");
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    const formattedDate = singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Recently';

    return (
        <div className="bg-[#EEF1F5] min-h-screen pb-20">
            <Navbar />
            <div className='max-w-5xl mx-auto pt-8 px-4'>
                
                {/* Header Card */}
                <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8'>
                    <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
                        <div className='flex flex-col sm:flex-row items-start gap-6'>
                            {singleJob?.company?.logo && (
                                <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-2 shrink-0">
                                    <img src={singleJob.company.logo} alt="Company Logo" className="w-full h-full object-contain" />
                                </div>
                            )}
                            <div>
                                <h1 className='font-extrabold text-3xl text-slate-900'>{singleJob?.title}</h1>
                                <div className='flex flex-wrap items-center gap-4 mt-3 text-slate-600 font-medium'>
                                    <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4"/> {singleJob?.company?.name || 'Company Name'}</div>
                                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {Array.isArray(singleJob?.location) ? singleJob.location.join(", ") : (singleJob?.location || "India")}</div>
                                </div>
                                <div className='flex flex-wrap items-center gap-2 mt-5'>
                                    <Badge className='flex items-center text-blue-700 bg-blue-50 border-transparent font-semibold py-1.5 px-4' variant="outline">
                                        <Users size={14} className="mr-1.5" />
                                        {singleJob?.position > 0 ? `${singleJob.position} Positions` : 'Multiple Positions'}
                                    </Badge>
                                    {singleJob?.employmentType && (
                                        <Badge className='flex items-center text-purple-700 bg-purple-50 border-transparent font-semibold py-1.5 px-4' variant="outline">
                                            {singleJob.employmentType.toLowerCase() === 'internship' ? <GraduationCap size={14} className="mr-1.5" /> : <Briefcase size={14} className="mr-1.5" />}
                                            {singleJob.employmentType}
                                        </Badge>
                                    )}
                                    {singleJob?.workMode && (
                                        <Badge className='flex items-center text-orange-700 bg-orange-50 border-transparent font-semibold py-1.5 px-4' variant="outline">
                                            <Laptop size={14} className="mr-1.5" />
                                            {singleJob.workMode}
                                        </Badge>
                                    )}
                                    <Badge className='flex items-center text-slate-700 bg-slate-100 border-transparent font-semibold py-1.5 px-4' variant="outline">
                                        <Clock size={14} className="mr-1.5" />
                                        {singleJob?.jobType || 'Full-time'}
                                    </Badge>
                                    <Badge className='flex items-center text-emerald-700 bg-emerald-50 border-transparent font-semibold py-1.5 px-4' variant="outline">
                                        <Banknote size={14} className="mr-1.5" />
                                        {formatSalary(singleJob)}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-auto shrink-0">
                            <Button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied}
                                size="lg"
                                className={`w-full md:w-auto rounded-xl py-6 px-8 text-base font-semibold shadow-md transition-all ${isApplied ? 'bg-slate-300 text-slate-600 hover:bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-1 text-white'}`}>
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Grid Layout for Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-8'>
                            <h2 className='text-xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
                                Job Description
                            </h2>
                            <div className="prose max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap border border-slate-200 p-6 bg-slate-50 rounded-xl shadow-sm">
                                {singleJob?.description || "No detailed description provided."}
                            </div>
                            
                            {singleJob?.requirements && singleJob.requirements.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Requirements</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {singleJob.requirements.map((req, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                                                {req}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Information */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-6'>
                            <h2 className='text-lg font-bold text-slate-900 mb-6'>Job Overview</h2>
                            
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><CalendarDays className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Posted Date</p>
                                        <p className="text-base font-semibold text-slate-900">{formattedDate}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Briefcase className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Experience</p>
                                        <p className="text-base font-semibold text-slate-900">{formatExperience(singleJob)}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><IndianRupee className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Salary Range</p>
                                        <p className="text-base font-semibold text-slate-900">{formatSalary(singleJob)}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Laptop className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Work Mode</p>
                                        <p className="text-base font-semibold text-slate-900">{singleJob?.workMode || 'On-site'}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Clock className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Job Type</p>
                                        <p className="text-base font-semibold text-slate-900">{singleJob?.jobType || 'Full-time'}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Users className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Total Applicants</p>
                                        <p className="text-base font-semibold text-slate-900">{singleJob?.applications?.length || 0}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription