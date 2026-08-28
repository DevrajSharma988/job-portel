import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import Home from './pages/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './pages/admin/Companies'
import CompanyCreate from './pages/admin/CompanyCreate'
import CompanySetup from './pages/admin/CompanySetup'
import AdminJobs from "./pages/admin/AdminJobs";
import PostJob from './pages/admin/PostJob'
import Applicants from './pages/admin/Applicants'
import ProtectedRoute from './pages/admin/ProtectedRoute'
import RecruiterDashboard from './pages/admin/RecruiterDashboard'
import CompanyRequiredRoute from './pages/admin/CompanyRequiredRoute'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/dashboard",
    element: <ProtectedRoute><RecruiterDashboard/></ProtectedRoute>
  },
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<CompanyRequiredRoute><AdminJobs/></CompanyRequiredRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<CompanyRequiredRoute><PostJob/></CompanyRequiredRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<CompanyRequiredRoute><Applicants/></CompanyRequiredRoute> 
  },

])
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setUser } from './redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from './utils/constant'
import store from './redux/store'

// Setup Axios Interceptors to handle token expiration silently
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes('/login') || originalRequest.url.includes('/refresh')) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        await axios.post(`${USER_API_END_POINT}/refresh-token`, {}, { withCredentials: true });
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, tokens are dead. Clear state and kick to login.
        store.dispatch(setUser(null));
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Clear any stuck loading state from redux-persist on initial load
    dispatch(setLoading(false))
  }, [dispatch])

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App