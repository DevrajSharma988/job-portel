import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${JOB_API_END_POINT}/getrecruiterjobs`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
                dispatch(setAllAdminJobs([]));
            } finally {
                setLoading(false);
            }
        }
        fetchAllAdminJobs();
    },[dispatch])
    
    return { loading };
}

export default useGetAllAdminJobs