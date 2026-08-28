import { setCompanies} from '@/redux/companySlice'
import { COMPANY_API_END_POINT} from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setCompanies(res.data.companies));
                    if (res.data.companies.length === 0 && location.pathname === '/admin/companies') {
                        navigate("/admin/companies/create");
                    }
                }
            } catch (error) {
                console.log(error);
                dispatch(setCompanies([]));
            } finally {
                setLoading(false);
            }
        }
        fetchCompanies();
    },[dispatch, navigate, location.pathname])
    
    return { loading };
}

export default useGetAllCompanies