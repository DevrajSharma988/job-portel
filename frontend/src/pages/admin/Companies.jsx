import React, { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Search, Plus, Lock } from 'lucide-react'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector(store => store.company);
    const hasCompany = companies && companies.length > 0;

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input, dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-gray-900'>Company Management</h1>
                    <p className='text-gray-500 mt-1'>Manage your registered company profile and details.</p>
                </div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-5'>
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            className="pl-9 w-full sm:w-[280px]"
                            placeholder="Filter by name..."
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={() => navigate("/admin/companies/create")} 
                        disabled={hasCompany}
                        className={hasCompany ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}
                        title={hasCompany ? "You can only register one company" : "Register a new company"}
                    >
                        {hasCompany ? (
                            <><Lock className="w-4 h-4 mr-2"/> Company Registered</>
                        ) : (
                            <><Plus className="w-4 h-4 mr-2"/> New Company</>
                        )}
                    </Button>
                </div>
                <CompaniesTable/>
            </div>
        </div>
    )
}

export default Companies