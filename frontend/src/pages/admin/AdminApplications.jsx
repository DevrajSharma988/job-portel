import React, { useEffect, useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { MoreHorizontal, ArrowLeft, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT, getDownloadUrl } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../../components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const shortlistingStatus = ["Accept", "Reject"];

const AdminApplications = () => {
    const { allAdminJobs } = useSelector(store => store.job);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllApplications = async () => {
            try {
                setLoading(true);
                const promises = allAdminJobs.map(job => 
                    axios.get(`${APPLICATION_API_END_POINT}/${job._id}/applicants`, { withCredentials: true })
                );
                const responses = await Promise.all(promises);
                
                let allApps = [];
                responses.forEach(res => {
                    if (res.data.job && res.data.job.applications) {
                        res.data.job.applications.forEach(app => {
                            allApps.push({
                                ...app, 
                                jobTitle: res.data.job.title
                            });
                        });
                    }
                });

                // Sort by most recent
                allApps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setApplications(allApps);
            } catch (error) {
                console.log(error);
                toast.error("Failed to load applications");
            } finally {
                setLoading(false);
            }
        };

        if (allAdminJobs && allAdminJobs.length > 0) {
            fetchAllApplications();
        } else {
            setLoading(false);
        }
    }, [allAdminJobs]);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
                // Update local state to reflect the change
                setApplications(prev => prev.map(app => 
                    app._id === id ? { ...app, status: status } : app
                ));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="bg-[#EEF1F5] min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 mt-10'>
                <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-slate-900'>All Applications ({applications.length})</h1>
                    <p className='text-slate-500 mt-1'>Review all candidates who have applied to your jobs.</p>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center min-h-[30vh]'>
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className='text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300'>
                        <h2 className='text-lg font-medium text-slate-600'>No applications found</h2>
                        <p className='text-slate-400'>You don't have any applicants yet.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-300 shadow-sm rounded-xl overflow-x-auto mb-20">
                        <Table>
                            <TableCaption className="pb-4 pt-4 border-t">A list of all recent applicants</TableCaption>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>FullName</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Job Applied</TableHead>
                                    <TableHead>Resume</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    applications.map((item) => (
                                        <TableRow key={item._id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium">{item?.applicant?.fullname || "Unknown"}</TableCell>
                                            <TableCell>{item?.applicant?.email || "N/A"}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200">
                                                    {item.jobTitle}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    item?.applicant?.profile?.resume ? 
                                                    <a className="text-blue-600 hover:underline hover:text-blue-800 font-medium" href={getDownloadUrl(item?.applicant?.profile?.resume, item?.applicant?.profile?.resumeOriginalName)} target="_blank" rel="noopener noreferrer">
                                                        {item?.applicant?.profile?.resumeOriginalName}
                                                    </a> : <span className="text-slate-400 italic">NA</span>
                                                }
                                            </TableCell>
                                            <TableCell className="text-slate-500 whitespace-nowrap">
                                                {item?.createdAt?.split("T")[0]}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${item?.status === "rejected" ? 'bg-red-100 text-red-700 hover:bg-red-200' : item?.status === 'pending' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-green-100 text-green-700 hover:bg-green-200'} border-none`}>
                                                    {item?.status?.toUpperCase() || 'UNKNOWN'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {item?.status?.toLowerCase() === 'pending' ? (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="w-5 h-5 text-slate-500" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-32 p-2">
                                                            <div className="flex flex-col gap-1">
                                                                {shortlistingStatus.map((status, index) => (
                                                                    <Button 
                                                                        key={index} 
                                                                        variant="ghost" 
                                                                        className={`justify-start w-full ${status === 'Accept' ? 'hover:text-green-600 hover:bg-green-50' : 'hover:text-red-600 hover:bg-red-50'}`}
                                                                        onClick={() => statusHandler(status === 'Accept' ? 'accepted' : 'rejected', item?._id)}
                                                                    >
                                                                        {status}
                                                                    </Button>
                                                                ))}
                                                            </div>
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
                )}
            </div>
        </div>
    )
}

export default AdminApplications;
