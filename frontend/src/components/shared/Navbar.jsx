import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2, ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

// Pages where the back button should appear (sub-pages, not main nav destinations)
const backButtonPages = [
    '/description',
    '/profile',
    '/saved-jobs',
    '/applied-jobs',
    '/admin/companies/create',
    '/admin/companies/',
    '/admin/jobs/create',
    '/admin/jobs/edit',
    '/admin/jobs/',
    '/admin/applications',
];

const shouldShowBack = (pathname) => {
    // Home, /jobs, /explore, /login, /signup, /admin/dashboard, /admin/jobs (exact) => NO back
    const noBackPages = ['/', '/jobs', '/explore', '/login', '/signup', '/forgot-password', '/reset-password', '/verify-email', '/admin/dashboard', '/admin/jobs'];
    if (noBackPages.includes(pathname)) return false;
    // Everything else gets a back button
    return true;
};

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

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

    const showBack = shouldShowBack(location.pathname);

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => {
        const active = location.pathname.startsWith(path) && (path !== '/' || location.pathname === '/');
        return `px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
            active 
                ? 'bg-sky-900/30 text-white border border-sky-400/30 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)]' 
                : 'text-sky-50 border border-transparent hover:bg-sky-700/50 hover:border-sky-500/30'
        }`;
    };

    return (
        <div className='bg-sky-600/85 backdrop-blur-xl border-b border-sky-500/50 sticky top-0 z-50 shadow-sm'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-8'>
                {/* Left side: Back button + Logo */}
                <div className='flex items-center gap-4'>
                    {showBack && (
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-1.5 text-sky-100 hover:text-white transition-all px-3 py-1.5 rounded-md hover:bg-sky-700/80 border border-sky-600/50 hover:border-sky-500 bg-sky-700/40 shadow-sm"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-4 h-4"/>
                            <span className="text-sm font-medium">Back</span>
                        </button>
                    )}
                    <h1 className='text-2xl font-bold cursor-pointer text-white' onClick={() => navigate(user?.role === 'recruiter' ? "/admin/dashboard" : "/")}>
                        Career<span className='text-sky-200'>Nest</span>
                    </h1>
                </div>

                {/* Right side: Nav links + Auth */}
                <div className='flex items-center gap-6'>
                    <ul className='hidden md:flex font-medium items-center gap-3'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/" className={navLinkClass('/')}>Home</Link></li>
                                    <li><Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>Dashboard</Link></li>
                                    <li><Link to="/admin/jobs" className={navLinkClass('/admin/jobs')}>Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className={navLinkClass('/')}>Home</Link></li>
                                    <li><Link to="/jobs" className={navLinkClass('/jobs')}>Jobs</Link></li>
                                    <li><Link to="/explore" className={navLinkClass('/explore')}>Explore</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-3 pl-2 border-l border-sky-500/50'>
                                <Link to="/login">
                                    <button className="px-4 py-2 rounded-md text-sm font-medium border border-sky-500/50 text-sky-50 bg-sky-700/50 hover:bg-sky-700 hover:border-sky-500 transition-all">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="px-4 py-2 rounded-md text-sm font-medium border border-white bg-white text-sky-700 hover:bg-sky-50 transition-all shadow-sm">
                                        Signup
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer h-9 w-9 border-2 border-slate-200 hover:border-blue-300 transition-colors">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                        <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-semibold">{user?.fullname?.[0]}</AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3 bg-white shadow-lg rounded-xl border border-slate-200">
                                    <div className='flex flex-col'>
                                        <div className='flex items-center gap-3 p-2'>
                                            <Avatar className="cursor-pointer border border-slate-200">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                                <AvatarFallback>{user?.fullname?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className='flex flex-col'>
                                                <h4 className='font-semibold text-slate-800 text-sm'>{user?.fullname}</h4>
                                                <span className='text-xs text-slate-500 capitalize'>{user?.role === 'student' ? 'applicant' : user?.role}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="h-px bg-slate-100 my-2"></div>
                                        
                                        <div className='flex flex-col gap-1 text-slate-700'>
                                            <Link 
                                                to={user?.role === 'recruiter' ? "/admin/profile" : "/profile"} 
                                                className='flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors cursor-pointer text-sm font-medium'
                                            >
                                                <User2 className='w-4 h-4 text-slate-500' />
                                                <span>View Profile</span>
                                            </Link>

                                            <div 
                                                onClick={logoutHandler} 
                                                className='flex items-center gap-3 p-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-sm font-medium'
                                            >
                                                <LogOut className='w-4 h-4 text-slate-400 group-hover:text-red-600' />
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