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
    const [openProfile, setOpenProfile] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);

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
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='bg-white border border-gray-200 shadow-sm rounded-xl p-8 mb-8'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                        <div className='flex items-center gap-6'>
                            <div className="relative group">
                                <Avatar className="h-24 w-24 border-2 border-gray-100 shadow-sm">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                    <AvatarFallback className="text-3xl font-bold bg-blue-100 text-blue-600 uppercase">{user?.fullname?.[0]}</AvatarFallback>
                                </Avatar>
                                <label htmlFor="photo-upload-recruiter" className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-md transition-colors">
                                    <Camera className="w-4 h-4" />
                                </label>
                                <input id="photo-upload-recruiter" type="file" accept="image/jpeg, image/png, image/jpg" className="hidden" onChange={handleImageChange} />
                            </div>
                            <div>
                                <h1 className='font-bold text-2xl text-gray-900'>{user?.fullname}</h1>
                                <p className='text-gray-500 mt-1'>{user?.profile?.bio || "No bio provided"}</p>
                                <div className='mt-4 flex flex-col md:flex-row gap-4'>
                                    <div className='flex items-center gap-2 text-gray-600 text-sm'>
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-gray-600 text-sm'>
                                        <Contact className="w-4 h-4 text-gray-400" />
                                        <span>{user?.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                            <Button onClick={() => setOpenProfile(true)} variant="outline" className="flex gap-2 w-full justify-center">
                                <Pen size={16}/> Update Profile
                            </Button>
                            <Button onClick={() => setOpenPassword(true)} variant="outline" className="flex gap-2 w-full justify-center">
                                Change Password
                            </Button>
                            <Button onClick={logoutHandler} variant="ghost" className="flex gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 w-full justify-center">
                                <LogOut size={16}/> Logout
                            </Button>
                        </div>
                    </div>
                </div>

                {!hasCompany ? (
                    <div className='bg-blue-50/50 border border-blue-100 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm'>
                        <div className="text-6xl mb-6">🏢</div>
                        <h2 className='text-2xl font-bold text-gray-900 mb-3'>You haven't registered your company yet.</h2>
                        <p className='text-gray-500 mb-8 max-w-md'>Register your company to start posting jobs and finding the best candidates.</p>
                        <Button onClick={() => navigate("/admin/companies/create")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-base font-semibold shadow-md transition-all hover:shadow-lg">
                            Register Company
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-xl font-bold text-gray-900'>Dashboard Overview</h2>
                            <Button onClick={() => navigate("/admin/jobs/create")} className="bg-blue-600 hover:bg-blue-700">
                                Post a Job
                            </Button>
                        </div>
                        
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div className='bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col h-full hover:shadow-md transition-shadow'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='font-semibold text-gray-600'>My Company</h3>
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mb-6 flex-grow">
                                    {singleCompany?.logo ? (
                                        <img src={singleCompany.logo} alt="logo" className="w-12 h-12 rounded-md object-contain border bg-white" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center border text-2xl">🏢</div>
                                    )}
                                    <p className='text-xl font-bold text-gray-900 truncate' title={singleCompany?.name}>{singleCompany?.name}</p>
                                </div>
                                <Button 
                                    className="w-full mt-auto" 
                                    variant="outline" 
                                    onClick={() => navigate(`/admin/companies/${singleCompany._id}`)}
                                >
                                    Manage Company
                                </Button>
                            </div>

                            <div className='bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col h-full hover:shadow-md transition-shadow'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='font-semibold text-gray-600'>Total Jobs</h3>
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Briefcase className="w-5 h-5 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mb-6 flex-grow flex flex-col justify-center">
                                    <p className='text-4xl font-bold text-gray-900'>{totalJobs}</p>
                                    <p className="text-sm text-gray-500 mt-1">Active job postings</p>
                                </div>
                                <Button 
                                    className="w-full mt-auto" 
                                    variant="outline"
                                    onClick={() => navigate("/admin/jobs")}
                                >
                                    Manage Jobs
                                </Button>
                            </div>

                            <div className='bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col h-full hover:shadow-md transition-shadow'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='font-semibold text-gray-600'>Total Applications</h3>
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-green-600" />
                                    </div>
                                </div>
                                <div className="mb-6 flex-grow flex flex-col justify-center">
                                    <p className='text-4xl font-bold text-gray-900'>{totalApplications}</p>
                                    <p className="text-sm text-gray-500 mt-1">Candidates applied</p>
                                </div>
                                <Button 
                                    className="w-full mt-auto" 
                                    variant="outline"
                                    onClick={() => navigate("/admin/applications")}
                                >
                                    Review Applicants
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <UpdateProfileDialog open={openProfile} setOpen={setOpenProfile}/>
            <UpdatePasswordDialog open={openPassword} setOpen={setOpenPassword}/>
        </div>
    )
}

export default RecruiterDashboard;
