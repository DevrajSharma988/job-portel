import React, { useMemo } from 'react'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Clock, CheckCircle2, XCircle } from 'lucide-react'

const AppliedJobsPage = () => {
    useGetAppliedJobs();
    const { user } = useSelector(store => store.auth);
    const { allAppliedJobs } = useSelector(store => store.job);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user?.role === 'recruiter') {
            navigate("/admin/dashboard");
        } else if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    // Calculate stats
    const stats = useMemo(() => {
        const total = allAppliedJobs?.length || 0;
        let pending = 0, accepted = 0, rejected = 0;
        
        allAppliedJobs?.forEach(app => {
            if (app.status === 'pending') pending++;
            else if (app.status === 'accepted') accepted++;
            else if (app.status === 'rejected') rejected++;
        });

        return { total, pending, accepted, rejected };
    }, [allAppliedJobs]);

    return (
        <div className="bg-[#EEF1F5] min-h-screen pb-20">
            <Navbar />
            <div className='max-w-6xl mx-auto mt-8 mb-10 px-4'>
                <div className="mb-8">
                    <h1 className='font-bold text-3xl text-slate-900'>My Applied Jobs</h1>
                    <p className='text-slate-500 mt-1'>Track the status of your job applications</p>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Applied</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Accepted</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.accepted}</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <XCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Rejected</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.rejected}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Applied Job Table   */}
                    <AppliedJobTable />
                </div>
            </div>
        </div>
    )
}

export default AppliedJobsPage
