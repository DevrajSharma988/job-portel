import React, { useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import HeroSection from '../components/HeroSection'

import LatestJobs from '../components/LatestJobs'
import Footer from '../components/shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Map, Bookmark, UserCircle, AlertCircle, CheckCircle2 } from 'lucide-react'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  return (
    <div className="bg-[#EEF1F5] min-h-screen">
      <Navbar />
      <HeroSection />
      
      {!user ? null : user.role === 'recruiter' ? (
        <div className="max-w-7xl mx-auto mt-2 mb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-slate-300 p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
               Recruiter Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => navigate("/admin/profile")} className="group flex flex-col justify-center items-center gap-3 p-5 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-blue-50 transition-all text-center bg-[#F7F8FA] shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserCircle className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm text-slate-700 group-hover:text-slate-800">My Profile</span>
              </button>
              <button onClick={() => navigate("/admin/dashboard")} className="group flex flex-col justify-center items-center gap-3 p-5 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-blue-50 transition-all text-center bg-[#F7F8FA] shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Briefcase className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm text-slate-700 group-hover:text-blue-800">Dashboard</span>
              </button>
              <button onClick={() => navigate("/admin/jobs/create")} className="group flex flex-col justify-center items-center gap-3 p-5 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-blue-50 transition-all text-center bg-[#F7F8FA] shadow-sm hover:shadow-md">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Map className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm text-slate-700 group-hover:text-indigo-800">Post a Job</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto mt-2 mb-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-300 p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">
                   Quick Actions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button onClick={() => navigate("/explore")} className="group flex flex-col justify-center items-center gap-3 p-5 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-blue-50 transition-all text-center bg-[#F7F8FA] shadow-sm hover:shadow-md">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Map className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm text-slate-700 group-hover:text-blue-800">Explore Jobs</span>
                  </button>
                  <button onClick={() => navigate("/applied-jobs")} className="group flex flex-col justify-center items-center gap-3 p-5 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-blue-50 transition-all text-center bg-[#F7F8FA] shadow-sm hover:shadow-md">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm text-slate-700 group-hover:text-indigo-800">Applied Jobs</span>
                  </button>
                  <button onClick={() => navigate("/saved-jobs")} className="group flex flex-col justify-center items-center gap-3 p-5 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-blue-50 transition-all text-center bg-[#F7F8FA] shadow-sm hover:shadow-md">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Bookmark className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm text-slate-700 group-hover:text-emerald-800">Saved Jobs</span>
                  </button>
                  <button onClick={() => navigate("/profile")} className="group flex flex-col justify-center items-center gap-3 p-5 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-blue-50 transition-all text-center bg-[#F7F8FA] shadow-sm hover:shadow-md">
                    <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <UserCircle className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm text-slate-700 group-hover:text-slate-800">Update Profile</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-300 p-6 shadow-sm h-full">
                <h2 className="text-lg font-bold mb-5 text-slate-900 border-b border-slate-100 pb-4">
                   Profile Status
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between p-3 bg-[#F7F8FA] border border-slate-300 rounded-lg">
                    <span className="text-slate-700 font-medium text-sm">Name Details</span>
                    {user.fullname ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-4 h-4"/> DONE</span> : <span className="flex items-center gap-1 text-rose-600 text-xs font-bold"><AlertCircle className="w-4 h-4"/> MISSING</span>}
                  </li>
                  <li className="flex items-center justify-between p-3 bg-[#F7F8FA] border border-slate-300 rounded-lg">
                    <span className="text-slate-700 font-medium text-sm">Contact Email</span>
                    {user.email ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-4 h-4"/> DONE</span> : <span className="flex items-center gap-1 text-rose-600 text-xs font-bold"><AlertCircle className="w-4 h-4"/> MISSING</span>}
                  </li>
                  <li className="flex items-center justify-between p-3 bg-[#F7F8FA] border border-slate-300 rounded-lg">
                    <span className="text-slate-700 font-medium text-sm">Resume File</span>
                    {user.profile?.resume ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-4 h-4"/> DONE</span> : <span className="flex items-center gap-1 text-rose-600 text-xs font-bold"><AlertCircle className="w-4 h-4"/> MISSING</span>}
                  </li>
                  <li className="flex items-center justify-between p-3 bg-[#F7F8FA] border border-slate-300 rounded-lg">
                    <span className="text-slate-700 font-medium text-sm">Skills Added</span>
                    {user.profile?.skills?.length > 0 ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-4 h-4"/> DONE</span> : <span className="flex items-center gap-1 text-rose-600 text-xs font-bold"><AlertCircle className="w-4 h-4"/> MISSING</span>}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'recruiter' ? null : <LatestJobs />}
      <Footer />
    </div>
  )
}

export default Home