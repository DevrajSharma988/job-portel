import React, { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                if (res.data.user?.role === 'recruiter') {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.code === 'ACCOUNT_UNVERIFIED') {
                toast.error(error.response.data.message);
                navigate("/verify-email", { state: { email: input.email } });
            } else {
                toast.error(error.response?.data?.message || "An error occurred");
            }
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
        if(user){
            if (user.role === 'recruiter') {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        }
    },[user, navigate])
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />
            <div className='flex-1 flex w-full'>
                <div className="hidden lg:flex w-1/2 bg-slate-50 items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-sky-300 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-300 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
                    <div className="z-10 max-w-lg text-center">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Your Next Chapter Begins Here</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Sign in to explore top jobs, connect with industry leaders, and take your career to the next level.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-[#EEF1F5] lg:bg-white relative">
                    <form onSubmit={submitHandler} className='w-full max-w-md bg-white lg:bg-transparent border lg:border-none border-slate-200 rounded-2xl p-8 lg:p-0 shadow-sm lg:shadow-none relative z-10'>
                        <div className="text-center lg:text-left mb-8">
                            <h1 className='font-bold text-3xl text-slate-900 mb-2'>Welcome Back</h1>
                            <p className="text-slate-500">Please enter your details to sign in.</p>
                        </div>

                        <div className='space-y-5'>
                            <div className='space-y-2'>
                                <Label className="text-slate-700 font-semibold">Email Address</Label>
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="name@example.com"
                                    className="py-6 border-slate-200 focus-visible:ring-blue-600 bg-slate-50"
                                />
                            </div>

                            <div className='space-y-2'>
                                <div className="flex items-center justify-between">
                                    <Label className="text-slate-700 font-semibold">Password</Label>
                                    <Link to="/forgot-password" className='text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors'>Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        placeholder="••••••••"
                                        className="py-6 border-slate-200 focus-visible:ring-blue-600 bg-slate-50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8">
                            {
                                loading ? (
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold shadow-md transition-all" disabled> 
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Signing in...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold shadow-md transition-all">
                                        Sign In
                                    </Button>
                                )
                            }
                        </div>
                        <div className='mt-8 text-center text-sm text-slate-600'>
                            Don't have an account? <Link to="/signup" className='text-blue-600 hover:text-blue-800 font-bold ml-1 transition-colors'>Sign up for free</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login