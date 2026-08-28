import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Avatar, AvatarImage } from '../../components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { Edit2, MoreHorizontal, ExternalLink, MapPin } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(()=>{
        const filteredCompany = companies && companies.length > 0 ? companies.filter((company)=>{
            if(!searchCompanyByText){
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        }) : [];
        setFilterCompany(filteredCompany);
    },[companies,searchCompanyByText])

    if (!companies || companies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-gray-300 rounded-lg bg-gray-50/50 mt-5">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Companies Found</h3>
                <p className="text-gray-500 mb-6">You haven't registered any company yet.</p>
                <Button onClick={() => navigate("/admin/companies/create")} className="bg-blue-600 hover:bg-blue-700">
                    Register Company
                </Button>
            </div>
        )
    }

    return (
        <div className="border border-gray-200 rounded-lg shadow-sm mt-5 bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="w-[100px]">Logo</TableHead>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                No companies match your search.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterCompany.map((company) => (
                            <TableRow key={company._id} className="hover:bg-gray-50 transition-colors">
                                <TableCell>
                                    <Avatar className="h-12 w-12 border border-gray-100 shadow-sm">
                                        <AvatarImage src={company.logo || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} className="object-contain p-1" />
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">{company.name}</TableCell>
                                <TableCell>
                                    {company.website ? (
                                        <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                            {company.website} <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Not provided</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {company.location ? (
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                            {company.location}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Not provided</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-gray-600">{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32" align="end">
                                            <div onClick={()=> navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-full p-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors'>
                                                <Edit2 className='w-4 h-4 text-gray-600' />
                                                <span className="font-medium">Edit / View</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable