import React, { useEffect } from 'react'
import Navbar from '../components/shared/Navbar'
import HeroSection from '../components/HeroSection'
import CategoryCarousel from '../components/CategoryCarousel'
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
      
      {!user ? (
        <CategoryCarousel />
      ) : (
        <div className="max-w-7xl mx-auto my-10 px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button onClick={() => navigate("/browse")} className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors font-medium">Browse Jobs</button>
                  <button onClick={() => navigate("/profile")} className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors font-medium">View Applied Jobs</button>
                  <button onClick={() => navigate("/profile")} className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors font-medium">Update Profile</button>
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Profile Completion</h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    {user.fullname ? <span className="text-green-500 font-bold">✔</span> : <span className="text-red-500 font-bold">✖</span>} Name
                  </li>
                  <li className="flex items-center gap-3">
                    {user.email ? <span className="text-green-500 font-bold">✔</span> : <span className="text-red-500 font-bold">✖</span>} Email
                  </li>
                  <li className="flex items-center gap-3">
                    {user.profile?.resume ? <span className="text-green-500 font-bold">✔</span> : <span className="text-red-500 font-bold">✖</span>} Resume
                  </li>
                  <li className="flex items-center gap-3">
                    {user.profile?.skills?.length > 0 ? <span className="text-green-500 font-bold">✔</span> : <span className="text-red-500 font-bold">✖</span>} Skills
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