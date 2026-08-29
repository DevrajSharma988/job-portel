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
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10 px-4'>
        <Button onClick={() => navigate(-1)} variant="ghost" className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-5 h-5"/>
            Back
        </Button>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>Job Management</h1>
          <p className='text-gray-500 mt-1'>Post and manage your job listings.</p>
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-5'>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-9 w-full sm:w-[280px]"
              placeholder="Filter by role, salary, or location..."
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate("/admin/jobs/create")} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2"/>Post New Job
          </Button>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs