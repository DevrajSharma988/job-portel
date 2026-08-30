import React, { useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {applicants} = useSelector(store=>store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);
    return (
        <div className="bg-[#EEF1F5] min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 mt-8 mb-12'>
                <div className='bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 relative overflow-hidden'>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -mr-20 -mt-20 pointer-events-none opacity-50"></div>
                    <div className='flex items-center gap-5 mb-8 pb-6 border-b border-slate-100 relative z-10'>
                        <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2 text-slate-600 font-semibold border-slate-200 bg-white hover:bg-slate-50 shadow-sm">
                            <ArrowLeft className="w-4 h-4"/>
                            <span>Back</span>
                        </Button>
                        <div>
                            <h1 className='font-bold text-2xl text-slate-900 tracking-tight'>Applicants ({applicants?.applications?.length || 0})</h1>
                            <p className="text-slate-500 mt-1">Review candidates who applied for this role.</p>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <ApplicantsTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Applicants