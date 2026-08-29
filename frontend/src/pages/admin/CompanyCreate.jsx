import React, { useState, useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { ArrowLeft } from 'lucide-react'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const { companies } = useSelector(store => store.company);

    useEffect(() => {
        if (companies && companies.length > 0) {
            navigate("/admin/dashboard");
            toast.error("You have already registered a company.");
        }
    }, [companies, navigate]);

    const handleContinue = () => {
        if(!companyName) {
            toast.error("Company name is required.");
            return;
        }
        setOpenDialog(true);
    };

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error creating company");
        } finally {
            setOpenDialog(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 px-4'>
                <Button onClick={() => navigate(-1)} variant="ghost" className="flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-5 h-5"/>
                    Back
                </Button>
                <div className='bg-white border border-gray-200 shadow-sm rounded-xl p-8 max-w-2xl mx-auto'>
                    <div className='mb-8'>
                        <h1 className='font-bold text-2xl text-gray-900'>Register Your Company</h1>
                        <p className='text-gray-500 mt-2'>What would you like to name your company? <br />
                        <span className="text-amber-600 font-medium">Note: The company name cannot be changed after registration.</span></p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Label className="text-base font-semibold text-gray-700">Company Name</Label>
                            <Input
                                type="text"
                                className="mt-2 text-lg py-6 focus-visible:ring-blue-600"
                                placeholder="e.g. Acme Corp, Google, etc."
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className='flex items-center gap-4 pt-4 border-t'>
                            <Button variant="outline" className="w-full text-base py-6" onClick={() => navigate("/admin/dashboard")}>Cancel</Button>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base py-6" onClick={handleContinue}>Continue</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Confirm Company Registration</DialogTitle>
                    </DialogHeader>
                    <div className="py-6 flex flex-col gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                            <span className="text-sm text-gray-500 block mb-1">Company Name</span>
                            <span className="text-2xl font-bold text-gray-900">{companyName}</span>
                        </div>
                        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm border border-amber-200">
                            <strong>Important:</strong> The company name cannot be changed after registration. Please ensure it is spelled correctly.
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto" onClick={registerNewCompany}>Register Company</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CompanyCreate