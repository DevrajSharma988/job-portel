import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { setCompanies } from "@/redux/companySlice";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CompanyRequiredRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const { companies } = useSelector(store => store.company);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user === null || user.role !== 'recruiter') {
            navigate("/");
            return;
        }

        const checkCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                    if (res.data.companies.length === 0) {
                        toast.error("Please register a company before managing jobs.");
                        navigate("/admin/dashboard");
                    } else {
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.log(error);
                navigate("/admin/dashboard");
            }
        };

        if (companies.length > 0) {
            setLoading(false);
        } else {
            checkCompany();
        }
    }, [user, navigate, dispatch, companies.length]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>;
    }

    return <>{children}</>;
};

export default CompanyRequiredRoute;
