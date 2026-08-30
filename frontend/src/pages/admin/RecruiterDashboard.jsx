import React, { useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Contact, Pen, Briefcase, Building2, Users, LogOut, FileText, Camera } from 'lucide-react';
import UpdateProfileDialog from '@/components/UpdateProfileDialog';
import UpdatePasswordDialog from '@/components/UpdatePasswordDialog';

const RecruiterDashboard = () => {
    const { loading: companiesLoading } = useGetAllCompanies(); // Fetches companies and populates redux
    const { loading: jobsLoading } = useGetAllAdminJobs(); // Fetches jobs and populates redux
    const { user } = useSelector(store => store.auth);
    const { companies } = useSelector(store => store.company);
    const { allAdminJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Profile photo updated successfully!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update photo");
        }
    };

    const hasCompany = companies && companies.length > 0;
    const singleCompany = hasCompany ? companies[0] : null;

    const totalJobs = allAdminJobs ? allAdminJobs.length : 0;
    const totalApplications = allAdminJobs ? allAdminJobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0) : 0;

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/logout`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    };

    if (companiesLoading || jobsLoading) {
        return (
            <div>
                <Navbar />
                <div className='max-w-4xl mx-auto my-5 flex justify-center items-center min-h-[50vh]'>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#EEF1F5] min-h-screen pb-12">
            <Navbar />
            
            {/* Dashboard Header/Banner */}
            <div className="bg-white border-b border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-50 to-indigo-50/50 pointer-events-none"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-sky-200 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recruiter Dashboard</h1>
                            <p className="text-slate-500 mt-2 text-lg">Manage your company profile, job postings, and candidates.</p>
                        </div>
                        {hasCompany && (
                            <Button onClick={() => navigate("/admin/jobs/create")} className="bg-sky-600 hover:bg-sky-700 text-white shadow-md transition-all hover:shadow-lg w-full md:w-auto px-6 py-6 text-base font-semibold rounded-xl">
                                + Post a New Job
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className='max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8'>
                {!hasCompany ? (
                    <div className='bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm relative overflow-hidden'>
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/30 to-transparent pointer-events-none"></div>
                        <div className="w-24 h-24 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-sky-200">
                            <Building2 className="w-10 h-10" />
                        </div>
                        <h2 className='text-3xl font-bold text-slate-900 mb-4'>Company Setup Required</h2>
                        <p className='text-slate-500 mb-8 max-w-lg text-lg leading-relaxed'>You need to register your company details before you can start posting jobs and reviewing candidates.</p>
                        <Button onClick={() => navigate("/admin/companies/create")} className="bg-sky-600 hover:bg-sky-700 text-white px-10 py-6 rounded-xl text-lg font-bold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                            Register Your Company
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Metrics Row */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col h-full hover:shadow-md hover:border-sky-300 transition-all duration-300 group relative overflow-hidden'>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 pointer-events-none"></div>
                                <div className='flex items-start justify-between mb-6 relative z-10'>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">My Company</p>
                                        <h3 className='font-bold text-slate-900 text-lg truncate w-[180px]' title={singleCompany?.name}>{singleCompany?.name}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-xl shadow-sm border border-blue-200">
                                        <Building2 className="w-6 h-6 text-blue-700" />
                                    </div>
                                </div>
                                <div className="flex-grow flex items-center justify-center mb-6 relative z-10">
                                    {singleCompany?.logo ? (
                                        <img src={singleCompany.logo} alt="logo" className="w-20 h-20 rounded-xl object-contain border border-slate-200 bg-white shadow-sm" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 text-3xl shadow-sm">🏢</div>
                                    )}
                                </div>
                                <Button 
                                    className="w-full mt-auto bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 font-semibold transition-all relative z-10 shadow-sm" 
                                    variant="outline" 
                                    onClick={() => navigate(`/admin/companies/${singleCompany._id}`)}
                                >
                                    Manage Company
                                </Button>
                            </div>

                            <div className='bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col h-full hover:shadow-md hover:border-indigo-300 transition-all duration-300 group relative overflow-hidden'>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 pointer-events-none"></div>
                                <div className='flex items-start justify-between mb-2 relative z-10'>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Jobs</p>
                                        <h3 className='font-bold text-slate-900 text-lg'>Total Postings</h3>
                                    </div>
                                    <div className="p-3 bg-indigo-100 rounded-xl shadow-sm border border-indigo-200">
                                        <Briefcase className="w-6 h-6 text-indigo-700" />
                                    </div>
                                </div>
                                <div className="mb-6 flex-grow flex flex-col justify-center relative z-10">
                                    <div className="flex items-baseline gap-2">
                                        <p className='text-5xl font-extrabold text-slate-900 tracking-tight'>{totalJobs}</p>
                                        <span className="text-slate-500 font-medium">Jobs</span>
                                    </div>
                                </div>
                                <Button 
                                    className="w-full mt-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 font-semibold transition-all relative z-10 shadow-sm" 
                                    variant="outline"
                                    onClick={() => navigate("/admin/jobs")}
                                >
                                    Manage Jobs
                                </Button>
                            </div>

                            <div className='bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col h-full hover:shadow-md hover:border-emerald-300 transition-all duration-300 group relative overflow-hidden'>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 pointer-events-none"></div>
                                <div className='flex items-start justify-between mb-2 relative z-10'>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Candidates</p>
                                        <h3 className='font-bold text-slate-900 text-lg'>Total Applications</h3>
                                    </div>
                                    <div className="p-3 bg-emerald-100 rounded-xl shadow-sm border border-emerald-200">
                                        <FileText className="w-6 h-6 text-emerald-700" />
                                    </div>
                                </div>
                                <div className="mb-6 flex-grow flex flex-col justify-center relative z-10">
                                    <div className="flex items-baseline gap-2">
                                        <p className='text-5xl font-extrabold text-slate-900 tracking-tight'>{totalApplications}</p>
                                        <span className="text-slate-500 font-medium">Applicants</span>
                                    </div>
                                </div>
                                <Button 
                                    className="w-full mt-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 hover:border-emerald-300 font-semibold transition-all relative z-10 shadow-sm" 
                                    variant="outline"
                                    onClick={() => navigate("/admin/applications")}
                                >
                                    Review Applicants
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecruiterDashboard;
