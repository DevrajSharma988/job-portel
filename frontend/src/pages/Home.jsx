import React, { useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import HeroSection from '../components/HeroSection'

import LatestJobs from '../components/LatestJobs'
import Footer from '../components/shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);
  return (
    <div>
      <Navbar />
      <HeroSection />
      
      {!user ? null : (
        <div className="max-w-7xl mx-auto mt-2 mb-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <span className="text-xl">🚀</span> Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button onClick={() => navigate("/explore")} className="group flex flex-col justify-center items-center gap-3 p-6 border border-gray-100 rounded-2xl hover:border-purple-200 hover:bg-purple-50 transition-all">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-purple-700">Explore Jobs</span>
                  </button>
                  <button onClick={() => navigate("/applied-jobs")} className="group flex flex-col justify-center items-center gap-3 p-6 border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-blue-700">Applied Jobs</span>
                  </button>
                  <button onClick={() => navigate("/profile")} className="group flex flex-col justify-center items-center gap-3 p-6 border border-gray-100 rounded-2xl hover:border-orange-200 hover:bg-orange-50 transition-all">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-orange-700">Update Profile</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl text-white h-full relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span> Profile Status
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                    <span className="text-gray-300">Name Details</span>
                    {user.fullname ? <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">DONE</span> : <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">MISSING</span>}
                  </li>
                  <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                    <span className="text-gray-300">Contact Email</span>
                    {user.email ? <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">DONE</span> : <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">MISSING</span>}
                  </li>
                  <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                    <span className="text-gray-300">Resume File</span>
                    {user.profile?.resume ? <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">DONE</span> : <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">MISSING</span>}
                  </li>
                  <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm">
                    <span className="text-gray-300">Skills Added</span>
                    {user.profile?.skills?.length > 0 ? <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">DONE</span> : <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold">MISSING</span>}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <LatestJobs />
      <Footer />
    </div>
  )
}

export default Home