import React, { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Search, Plus, ArrowLeft } from 'lucide-react'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);

  return (
    <div className="bg-[#EEF1F5] min-h-screen">
      <Navbar />
      <div className='max-w-7xl mx-auto my-10 px-4'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900 tracking-tight'>Job Management</h1>
              <p className='text-slate-500 mt-2 text-lg'>Post and manage your job listings.</p>
            </div>
            <Button onClick={() => navigate("/admin/jobs/create")} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:shadow-lg w-full sm:w-auto px-6 py-6 text-base font-semibold rounded-xl">
              <Plus className="w-5 h-5 mr-2"/>Post New Job
            </Button>
        </div>

        <div className='bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 relative overflow-hidden'>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -mr-20 -mt-20 pointer-events-none opacity-50"></div>
            
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10'>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  className="pl-10 w-full sm:w-[320px] py-6 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 text-base"
                  placeholder="Filter by role, salary, or location..."
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
            
            <div className="relative z-10">
                <AdminJobsTable />
            </div>
        </div>
      </div>
    </div>
  )
}

export default AdminJobs