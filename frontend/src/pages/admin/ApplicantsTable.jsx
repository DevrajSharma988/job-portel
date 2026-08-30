import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT, getDownloadUrl } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../../components/ui/badge';

const shortlistingStatus = ["Accept", "Reject"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className="overflow-x-auto overflow-y-hidden border border-slate-200 rounded-xl">
            <Table>
                <TableCaption className="text-slate-500 py-4">A list of all candidates who applied for this role.</TableCaption>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <TableRow key={item._id} className="hover:bg-slate-50 transition-colors">
                                <TableCell className="font-medium text-slate-900">{item?.applicant?.fullname || "Unknown"}</TableCell>
                                <TableCell className="text-slate-700">{item?.applicant?.email || "N/A"}</TableCell>
                                <TableCell >
                                    {
                                        item?.applicant?.profile?.resume ? <a className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors" href={getDownloadUrl(item?.applicant?.profile?.resume, item?.applicant?.profile?.resumeOriginalName)} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span className="text-slate-400">NA</span>
                                    }
                                </TableCell>
                                <TableCell className="text-slate-500">{item?.applicant?.createdAt?.split("T")[0] || item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`${item?.status === "rejected" ? 'bg-red-50 text-red-700 border-red-200' : item?.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} font-medium shadow-none`}>
                                        {item?.status?.toUpperCase() || 'UNKNOWN'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {item?.status?.toLowerCase() === 'pending' ? (
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal className="cursor-pointer mx-auto md:ml-auto md:mr-0"/>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32 p-2">
                                                {
                                                    shortlistingStatus.map((status, index) => {
                                                        return (
                                                            <div onClick={() => statusHandler(status === 'Accept' ? 'accepted' : 'rejected', item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded w-full'>
                                                                <span className={status === 'Accept' ? 'text-green-600' : 'text-red-600'}>{status}</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <span className="text-sm text-slate-400 font-medium whitespace-nowrap">Decision Final</span>
                                    )}
                                </TableCell>

                            </TableRow>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable