import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
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
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname || "Unknown"}</TableCell>
                                <TableCell>{item?.applicant?.email || "N/A"}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber || "N/A"}</TableCell>
                                <TableCell >
                                    {
                                        item?.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant?.createdAt?.split("T")[0] || item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>
                                    <Badge className={`${item?.status === "rejected" ? 'bg-red-400' : item?.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
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
                                                            <div onClick={() => statusHandler(status === 'Accept' ? 'accepted' : 'rejected', item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full'>
                                                                <span className={status === 'Accept' ? 'text-green-600' : 'text-red-600'}>{status}</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <span className="text-sm text-gray-400 font-medium whitespace-nowrap">Decision Final</span>
                                    )}
                                </TableCell>

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable