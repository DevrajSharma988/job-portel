import React, { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const defaultEmail = location.state?.email || "";

    const [email, setEmail] = useState(defaultEmail);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const dispatch = useDispatch();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, { email, otp }, {
                headers: { 'Content-Type': "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                if (res.data.user?.role === 'recruiter') {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    }

    const resendHandler = async () => {
        if (!email) {
            return toast.error("Please provide your email to resend OTP.");
        }
        try {
            setResendLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/resend-otp`, { email }, {
                headers: { 'Content-Type': "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Verify Email</h1>
                    <p className='text-sm text-gray-500 mb-5'>Enter the 6-digit code sent to your email to verify your account.</p>
                    
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="patel@gmail.com"
                            disabled={!!defaultEmail}
                        />
                    </div>

                    <div className='my-2'>
                        <Label>OTP Code</Label>
                        <Input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            maxLength={6}
                        />
                    </div>
                    
                    <div className='mt-6'>
                        {loading ? (
                            <Button className="w-full my-4"> 
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait 
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4">Verify OTP</Button>
                        )}
                    </div>

                    <div className='text-center mt-2'>
                        <span className='text-sm text-gray-500'>Didn't receive a code? </span>
                        {resendLoading ? (
                            <span className='text-sm text-blue-600'><Loader2 className='inline h-3 w-3 animate-spin'/> Sending...</span>
                        ) : (
                            <span onClick={resendHandler} className='text-sm text-blue-600 cursor-pointer hover:underline'>Resend OTP</span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VerifyEmail
