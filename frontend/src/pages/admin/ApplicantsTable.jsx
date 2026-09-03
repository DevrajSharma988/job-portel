import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { MoreHorizontal, Eye } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT, getDownloadUrl } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';

const shortlistingStatus = ["Accept", "Reject"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
                
                // Update local state immediately
                if (applicants && applicants.applications) {
                    const updatedApplications = applicants.applications.map(app => 
                        app._id === id ? { ...app, status: status } : app
                    );
                    dispatch(setAllApplicants({ ...applicants, applications: updatedApplications }));
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    const filteredApplications = applicants?.applications?.filter(app => {
        if (filterStatus === "all") return true;
        return app?.status?.toLowerCase() === filterStatus.toLowerCase();
    });

    return (
        <div>
            <div className="flex justify-end items-center mb-4">
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Applicants</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto overflow-y-hidden border border-slate-200 rounded-xl">
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
                            filteredApplications?.map((item) => (
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
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal className="cursor-pointer mx-auto md:ml-auto md:mr-0"/>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2">
                                                <div onClick={() => setSelectedApplicant(item)} className='flex items-center gap-2 my-1 cursor-pointer px-3 py-1.5 rounded-md font-medium transition-colors w-full text-blue-600 hover:bg-blue-50'>
                                                    <Eye className="w-4 h-4"/>
                                                    <span>View Applicant Profile</span>
                                                </div>
                                                {item?.status?.toLowerCase() === 'pending' && shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status === 'Accept' ? 'accepted' : 'rejected', item?._id)} key={index} className={`flex items-center my-1 cursor-pointer px-3 py-1.5 rounded-md font-medium transition-colors w-full ${status === 'Accept' ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}>
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })}
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>

                                </TableRow>
                            ))
                        }
                        {filteredApplications?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4 text-slate-500">
                                    No applicants found for the selected filter.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col gap-4 mt-4">
                <p className="text-slate-500 text-sm text-center mb-2">A list of all candidates who applied for this role.</p>
                {
                    filteredApplications?.map((item) => (
                        <div key={item._id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{item?.applicant?.fullname || "Unknown"}</h3>
                                    <p className="text-sm text-slate-500">{item?.applicant?.email || "N/A"}</p>
                                </div>
                                <Badge variant="outline" className={`${item?.status === "rejected" ? 'bg-red-50 text-red-700 border-red-200' : item?.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} font-medium shadow-none text-xs`}>
                                    {item?.status?.toUpperCase() || 'UNKNOWN'}
                                </Badge>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3 mt-1">
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-xs">Resume</span>
                                    {item?.applicant?.profile?.resume ? (
                                        <a className="text-blue-600 hover:text-blue-800 font-medium truncate max-w-[120px]" href={getDownloadUrl(item?.applicant?.profile?.resume, item?.applicant?.profile?.resumeOriginalName)} target="_blank" rel="noopener noreferrer">
                                            {item?.applicant?.profile?.resumeOriginalName}
                                        </a>
                                    ) : <span className="text-slate-400">NA</span>}
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                    <span className="text-slate-400 text-xs">Applied On</span>
                                    <span className="text-slate-700">{item?.applicant?.createdAt?.split("T")[0] || item?.createdAt?.split("T")[0]}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedApplicant(item)}
                                className="w-full py-2 mt-3 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm border border-blue-100"
                            >
                                <Eye className="w-4 h-4"/> View Applicant Profile
                            </button>

                            {item?.status?.toLowerCase() === 'pending' && (
                                <div className="flex gap-2 mt-2 pt-3 border-t border-slate-100">
                                    <button 
                                        onClick={() => statusHandler('accepted', item?._id)}
                                        className="flex-1 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 font-medium rounded-lg text-sm transition-colors"
                                    >
                                        Accept
                                    </button>
                                    <button 
                                        onClick={() => statusHandler('rejected', item?._id)}
                                        className="flex-1 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg text-sm transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                }
                {filteredApplications?.length === 0 && (
                    <div className="text-center py-4 text-slate-500">
                        No applicants found for the selected filter.
                    </div>
                )}
            </div>

            {/* Applicant Profile Dialog */}
            <Dialog open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Applicant Profile</DialogTitle>
                    </DialogHeader>
                    {selectedApplicant && (
                        <div className="py-4 space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg text-slate-900">{selectedApplicant.applicant.fullname}</h3>
                                <p className="text-sm text-slate-500">{selectedApplicant.applicant.email}</p>
                            </div>
                            
                            {selectedApplicant.applicant.profile?.bio && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 mb-1">Bio</h4>
                                    <p className="text-sm text-slate-600">{selectedApplicant.applicant.profile.bio}</p>
                                </div>
                            )}

                            {selectedApplicant.applicant.profile?.skills && selectedApplicant.applicant.profile.skills.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedApplicant.applicant.profile.skills.map((skill, index) => (
                                            <Badge key={index} variant="secondary">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ApplicantsTable