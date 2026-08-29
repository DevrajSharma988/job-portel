import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, ArrowLeft, Camera } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import UpdateProfileDialog from './UpdateProfileDialog'
import UpdatePasswordDialog from './UpdatePasswordDialog'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {

    const [open, setOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    React.useEffect(() => {
        if (user?.role === 'recruiter') {
            navigate("/admin/dashboard");
        }
    }, [user, navigate]);

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <Navbar />
            <div className='max-w-4xl mx-auto my-5 px-4'>
                <Button onClick={() => navigate(-1)} variant="ghost" className="flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5"/>
                    Back
                </Button>
            </div>
            <div className='max-w-4xl mx-auto bg-white border border-gray-100 shadow-sm rounded-2xl mb-10 p-8'>
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-6'>
                        <div className="relative group">
                            <Avatar className="h-24 w-24 border-2 border-gray-100">
                                <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                <AvatarFallback className="text-3xl font-bold bg-blue-100 text-blue-600 uppercase">{user?.fullname?.[0]}</AvatarFallback>
                            </Avatar>
                            <label htmlFor="photo-upload" className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700 shadow-md transition-colors">
                                <Camera className="w-4 h-4" />
                            </label>
                            <input id="photo-upload" type="file" accept="image/jpeg, image/png, image/jpg" className="hidden" onChange={handleImageChange} />
                        </div>
                        <div>
                            <h1 className='font-bold text-2xl text-gray-800'>{user?.fullname}</h1>
                            <p className="text-gray-500 mt-1">{user?.profile?.bio || "No bio provided."}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                            <Pen className="w-4 h-4" /> Edit Profile
                        </Button>
                        <Button onClick={() => setPasswordOpen(true)} variant="outline" className="w-full">
                            Change Password
                        </Button>
                    </div>
                </div>
                
                <div className="h-px bg-gray-100 my-8"></div>
                
                <div className='my-5 space-y-4'>
                    <div className='flex items-center gap-3 text-gray-700'>
                        <div className="p-2 bg-gray-100 rounded-full">
                            <Mail className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="font-medium">{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-700'>
                        <div className="p-2 bg-gray-100 rounded-full">
                            <Contact className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="font-medium">{user?.phoneNumber || "Not provided"}</span>
                    </div>
                </div>
                {
                    user?.role === 'applicant' && (
                        <div className="mt-8">
                            <div className='mb-8'>
                                <h2 className="text-lg font-bold text-gray-800 mb-3">Skills</h2>
                                <div className='flex items-center gap-2 flex-wrap'>
                                    {
                                        user?.profile?.skills?.length !== 0 ? user?.profile?.skills?.map((item, index) => <Badge key={index} className="bg-gray-100 text-gray-700 hover:bg-gray-200">{item}</Badge>) : <span className="text-gray-500 italic">No skills added</span>
                                    }
                                </div>
                            </div>
                            <div className='grid w-full max-w-sm items-center gap-2'>
                                <Label className="text-lg font-bold text-gray-800">Resume</Label>
                                {
                                    user?.profile?.resume ? <a target='blank' href={user?.profile?.resume} className='text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> {user?.profile?.resumeOriginalName || 'Download Resume'}</a> : <span className="text-gray-500 italic">No resume uploaded</span>
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
            <UpdatePasswordDialog open={passwordOpen} setOpen={setPasswordOpen}/>
        </div>
    )
}

export default Profile