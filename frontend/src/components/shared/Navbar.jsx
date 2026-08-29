import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, Briefcase } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/logout`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-8'>
                <div>
                    <h1 className='text-2xl font-bold cursor-pointer' onClick={() => navigate(user?.role === 'recruiter' ? "/admin/dashboard" : "/")}>
                        Job<span className='text-[#F83002]'>Portal</span>
                    </h1>
                </div>
                <div className='flex items-center gap-8'>
                    <ul className='hidden md:flex font-medium items-center gap-6 text-gray-600'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/dashboard" className='hover:text-[#6A38C2] transition-colors'>Dashboard</Link></li>
                                    <li><Link to="/admin/jobs" className='hover:text-[#6A38C2] transition-colors'>Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className='hover:text-[#6A38C2] transition-colors'>Home</Link></li>
                                    <li><Link to="/jobs" className='hover:text-[#6A38C2] transition-colors'>Jobs</Link></li>
                                    <li><Link to="/explore" className='hover:text-[#6A38C2] transition-colors'>Explore</Link></li>
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                        <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3 bg-white shadow-lg rounded-xl border border-gray-100">
                                    <div className='flex flex-col'>
                                        <div className='flex items-center gap-3 p-2'>
                                            <Avatar className="cursor-pointer border border-gray-200">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                                <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className='flex flex-col'>
                                                <h4 className='font-semibold text-gray-800 text-sm'>{user?.fullname}</h4>
                                                <span className='text-xs text-gray-500 capitalize'>{user?.role === 'student' ? 'applicant' : user?.role}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="h-px bg-gray-100 my-2"></div>
                                        
                                        <div className='flex flex-col gap-1 text-gray-700'>
                                            <Link 
                                                to={user?.role === 'recruiter' ? "/admin/dashboard" : "/profile"} 
                                                className='flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-sm font-medium'
                                            >
                                                <User2 className='w-4 h-4 text-gray-500' />
                                                <span>View Profile</span>
                                            </Link>

                                            <div 
                                                onClick={logoutHandler} 
                                                className='flex items-center gap-3 p-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-sm font-medium'
                                            >
                                                <LogOut className='w-4 h-4 text-gray-400 group-hover:text-red-600' />
                                                <span>Logout</span>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar