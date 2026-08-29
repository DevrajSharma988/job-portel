import React, { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email }, {
                headers: { 'Content-Type': "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/reset-password", { state: { email } });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Forgot Password</h1>
                    <p className='text-sm text-gray-500 mb-5'>Enter your email address and we'll send you an OTP to reset your password.</p>
                    
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="patel@gmail.com"
                            required
                        />
                    </div>
                    
                    {loading ? (
                        <Button className="w-full my-4"> 
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait 
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">Send Reset OTP</Button>
                    )}
                    
                    <div className='text-center mt-2'>
                        <span className='text-sm'>Remember your password? <Link to="/login" className='text-blue-600'>Login</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
