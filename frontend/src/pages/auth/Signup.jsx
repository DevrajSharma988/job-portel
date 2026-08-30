import React, { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { RadioGroup } from '../../components/ui/radio-group'
import { Button } from '../../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, Eye, EyeOff } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        password: "",
        role: "applicant",
        file: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/verify-email", { state: { email: input.email } });
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred during signup");
        } finally{
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
                    <div className="absolute top-0 left-0 -ml-20 -mt-20 w-[600px] h-[600px] bg-sky-300 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
                    <div className="z-10 max-w-lg text-center">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Join the Future of Work</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Create an account to start applying to your dream jobs or to post opportunities and hire the best talent.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-[#EEF1F5] lg:bg-white relative">
                    <form onSubmit={submitHandler} className='w-full max-w-lg bg-white lg:bg-transparent border lg:border-none border-slate-200 rounded-2xl p-8 lg:p-0 shadow-sm lg:shadow-none relative z-10'>
                        <div className="text-center lg:text-left mb-8">
                            <h1 className='font-bold text-3xl text-slate-900 mb-2'>Create an Account</h1>
                            <p className="text-slate-500">Sign up to get started with CareerNest.</p>
                        </div>
                        
                        <div className='space-y-5'>
                            <div className='space-y-2'>
                                <Label className="text-slate-700 font-semibold">Full Name</Label>
                                <Input
                                    type="text"
                                    value={input.fullname}
                                    name="fullname"
                                    onChange={changeEventHandler}
                                    placeholder="John Doe"
                                    className="py-5 border-slate-200 focus-visible:ring-blue-600 bg-slate-50"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-slate-700 font-semibold">Email</Label>
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="name@example.com"
                                    className="py-5 border-slate-200 focus-visible:ring-blue-600 bg-slate-50"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-slate-700 font-semibold">Password</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        placeholder="••••••••"
                                        className="py-5 border-slate-200 focus-visible:ring-blue-600 bg-slate-50 pr-10"
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

                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 my-8'>
                            <div className='space-y-3'>
                                <Label className="text-slate-700 font-semibold">Account Type</Label>
                                <RadioGroup className="flex items-center gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="radio"
                                            name="role"
                                            id="applicant"
                                            value="applicant"
                                            checked={input.role === 'applicant'}
                                            onChange={changeEventHandler}
                                            className="cursor-pointer w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <Label htmlFor="applicant" className="cursor-pointer text-slate-700">Applicant</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="radio"
                                            name="role"
                                            id="recruiter"
                                            value="recruiter"
                                            checked={input.role === 'recruiter'}
                                            onChange={changeEventHandler}
                                            className="cursor-pointer w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <Label htmlFor="recruiter" className="cursor-pointer text-slate-700">Recruiter</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className='space-y-3 w-full sm:w-auto'>
                                <Label className="text-slate-700 font-semibold">Profile Photo</Label>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer border-slate-200 text-slate-600 w-full text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 px-3 pt-2"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            {
                                loading ? (
                                    <Button disabled className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold shadow-md transition-all"> 
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Creating account...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold shadow-md transition-all">
                                        Sign Up
                                    </Button>
                                )
                            }
                        </div>
                        <div className='mt-8 text-center text-sm text-slate-600'>
                            Already have an account? <Link to="/login" className='text-blue-600 hover:text-blue-800 font-bold ml-1 transition-colors'>Log in</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup