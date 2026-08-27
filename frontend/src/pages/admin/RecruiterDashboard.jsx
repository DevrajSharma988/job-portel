import React, { useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Mail, Contact, Pen, Briefcase, Building2, Users, LogOut } from 'lucide-react';
import UpdateProfileDialog from '@/components/UpdateProfileDialog';
import UpdatePasswordDialog from '@/components/UpdatePasswordDialog';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const RecruiterDashboard = () => {
    useGetAllCompanies(); // Fetches companies and populates redux
    const { user } = useSelector(store => store.auth);
    const { companies } = useSelector(store => store.company);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openProfile, setOpenProfile] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);

    const hasCompany = companies.length > 0;

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

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-5'>
                {!hasCompany && (
                    <div className='bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-8 mb-8 text-center'>
                        <div className="text-6xl mb-4">🏢</div>
                        <h2 className='text-2xl font-bold mb-2'>Welcome!</h2>
                        <p className='text-lg mb-6'>Before posting your first job, you need to register your company.</p>
                        <Button onClick={() => navigate("/admin/companies/create")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                            Register Company
                        </Button>
                    </div>
                )}

                <div className='bg-white border border-gray-200 rounded-2xl p-8 mb-8'>
                    <div className='flex justify-between items-start'>
                        <div className='flex items-center gap-4'>
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="profile" />
                            </Avatar>
                            <div>
                                <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                                <p className='text-gray-600'>{user?.profile?.bio || "No bio provided"}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button onClick={() => setOpenPassword(true)} variant="outline">Change Password</Button>
                            <Button onClick={() => setOpenProfile(true)} variant="outline" className="flex gap-2"><Pen size={16}/> Update Profile</Button>
                            <Button onClick={logoutHandler} variant="destructive" className="flex gap-2 mt-2"><LogOut size={16}/> Logout</Button>
                        </div>
                    </div>
                    <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center gap-3 text-gray-700'>
                            <Mail className="text-gray-400" />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 text-gray-700'>
                            <Contact className="text-gray-400" />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className={`border rounded-2xl p-6 ${hasCompany ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='font-bold text-lg'>Companies</h3>
                            <Building2 className="text-gray-400" />
                        </div>
                        <p className='text-3xl font-bold mb-4'>{companies.length}</p>
                        <Button 
                            className="w-full" 
                            variant="outline" 
                            onClick={() => navigate("/admin/companies")}
                        >
                            Manage Companies
                        </Button>
                    </div>

                    <div className={`border rounded-2xl p-6 ${hasCompany ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='font-bold text-lg'>Jobs</h3>
                            <Briefcase className="text-gray-400" />
                        </div>
                        <p className='text-sm text-gray-500 mb-4'>Post and manage job listings</p>
                        <Button 
                            className="w-full" 
                            disabled={!hasCompany}
                            onClick={() => navigate("/admin/jobs")}
                        >
                            Manage Jobs
                        </Button>
                    </div>

                    <div className={`border rounded-2xl p-6 ${hasCompany ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='font-bold text-lg'>Quick Actions</h3>
                            <Users className="text-gray-400" />
                        </div>
                        <p className='text-sm text-gray-500 mb-4'>Ready to hire?</p>
                        <Button 
                            className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]" 
                            disabled={!hasCompany}
                            onClick={() => navigate("/admin/jobs/create")}
                        >
                            Post a Job
                        </Button>
                    </div>
                </div>
            </div>
            <UpdateProfileDialog open={openProfile} setOpen={setOpenProfile}/>
            <UpdatePasswordDialog open={openPassword} setOpen={setOpenPassword}/>
        </div>
    )
}

export default RecruiterDashboard;
