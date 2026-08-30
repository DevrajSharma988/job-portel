import React, { useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Pen, LogOut, Camera } from 'lucide-react';
import UpdateProfileDialog from '@/components/UpdateProfileDialog';
import UpdatePasswordDialog from '@/components/UpdatePasswordDialog';

const RecruiterProfile = () => {
    const { user } = useSelector(store => store.auth);
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
        <div className="bg-[#EEF1F5] min-h-screen">
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='bg-white border border-slate-300 shadow-sm rounded-xl mb-8 overflow-hidden'>
                    <div className="w-full relative bg-gradient-to-r from-sky-500 to-blue-600 h-32">
                        <svg className="absolute bottom-0 w-full h-12" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                            <path fill="#ffffff" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                    <div className='p-8 pt-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-end gap-6'>
                            <div className="relative group -mt-16 sm:-mt-20">
                                <Avatar className="h-28 w-28 border-4 border-white shadow-md bg-white">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="profile" className="object-cover" />
                                    <AvatarFallback className="text-3xl font-bold bg-sky-100 text-sky-700 uppercase">{user?.fullname?.[0]}</AvatarFallback>
                                </Avatar>
                                <label htmlFor="photo-upload-recruiter" className="absolute bottom-1 right-1 p-2 bg-sky-600 rounded-full text-white cursor-pointer hover:bg-sky-700 shadow-lg transition-transform hover:scale-105 border-2 border-white">
                                    <Camera className="w-4 h-4" />
                                </label>
                                <input id="photo-upload-recruiter" type="file" accept="image/jpeg, image/png, image/jpg" className="hidden" onChange={handleImageChange} />
                            </div>
                            <div className="mb-2">
                                <h1 className='font-bold text-3xl text-slate-900 tracking-tight'>{user?.fullname}</h1>
                                <p className='text-slate-500 mt-1'>{user?.profile?.bio || "No bio provided"}</p>
                                <div className='mt-4 flex flex-col md:flex-row gap-4'>
                                    <div className='flex items-center gap-2 text-slate-600 text-sm'>
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span>{user?.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mb-2">
                            <Button onClick={() => setOpenProfile(true)} variant="outline" className="flex gap-2 border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm">
                                <Pen size={16}/> Edit Profile
                            </Button>
                            <Button onClick={() => setOpenPassword(true)} variant="outline" className="flex gap-2 border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm">
                                Change Password
                            </Button>
                            <Button onClick={logoutHandler} variant="outline" className="flex gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 shadow-sm">
                                <LogOut size={16}/> Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <UpdateProfileDialog open={openProfile} setOpen={setOpenProfile} />
            <UpdatePasswordDialog open={openPassword} setOpen={setOpenPassword} />
        </div>
    )
}

export default RecruiterProfile;
