import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import Home from './pages/Home'
import Jobs from './components/Jobs'
import Explore from './components/Explore'
import Profile from './components/Profile'
import AppliedJobsPage from './components/AppliedJobsPage'
import JobDescription from './components/JobDescription'
import SavedJobs from './components/SavedJobs'

import CompanyCreate from './pages/admin/CompanyCreate'
import CompanySetup from './pages/admin/CompanySetup'
import AdminJobs from "./pages/admin/AdminJobs";
import PostJob from './pages/admin/PostJob'
import EditJob from './pages/admin/EditJob'
import Applicants from './pages/admin/Applicants'
import AdminApplications from './pages/admin/AdminApplications'
import ProtectedRoute from './pages/admin/ProtectedRoute'
import RecruiterDashboard from './pages/admin/RecruiterDashboard'
import RecruiterProfile from './pages/admin/RecruiterProfile'
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
    path: "/explore",
    element: <Explore />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/applied-jobs",
    element: <AppliedJobsPage />
  },
  {
    path: "/saved-jobs",
    element: <SavedJobs />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/dashboard",
    element: <ProtectedRoute><RecruiterDashboard/></ProtectedRoute>
  },
  {
    path:"/admin/profile",
    element: <ProtectedRoute><RecruiterProfile/></ProtectedRoute>
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
    path:"/admin/jobs/edit/:id",
    element:<CompanyRequiredRoute><EditJob/></CompanyRequiredRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<CompanyRequiredRoute><Applicants/></CompanyRequiredRoute> 
  },
  {
    path:"/admin/applications",
    element:<CompanyRequiredRoute><AdminApplications/></CompanyRequiredRoute> 
  },

])
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setLoading, setUser } from './redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from './utils/constant'
import store from './redux/store'
import { toast } from 'sonner'

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Setup Axios Interceptors to handle token expiration silently and standard errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Network Errors (Backend offline, timeout, no internet)
    if (!error.response) {
      error.response = { data: { message: "Network error. Please check your connection or try again later." } };
      toast.error(error.response.data.message);
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthRoute = originalRequest.url.includes('/login') || originalRequest.url.includes('/register') || originalRequest.url.includes('/refresh');

    // 2. Handle Token Expiration (401)
    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        axios.post(`${USER_API_END_POINT}/refresh-token`, {}, { withCredentials: true })
          .then(({ data }) => {
            processQueue(null, data.token);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            store.dispatch(setUser(null));
            toast.error("Your session has expired. Please log in again.");
            window.location.href = "/login";
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // 3. Global HTTP Status Code Mappings
    // Do not override user-friendly backend messages for 400 bad requests.
    if (!isAuthRoute || status >= 500) {
      switch (status) {
        case 401:
          if (!isAuthRoute) error.response.data.message = "Your session has expired. Please log in again.";
          break;
        case 403:
          error.response.data.message = "You are not authorized to perform this action.";
          break;
        case 404:
          error.response.data.message = "Requested resource was not found.";
          break;
        case 409:
          error.response.data.message = error.response.data.message || "Conflict with existing data. An account with this email might already exist.";
          break;
        case 422:
          error.response.data.message = "Please check the entered information.";
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          error.response.data.message = "Something went wrong. Please try again later.";
          break;
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