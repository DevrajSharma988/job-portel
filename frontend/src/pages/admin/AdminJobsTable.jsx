import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover'
import { Edit2, Eye, MoreHorizontal, Trash2, Briefcase, MapPin } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Badge } from '@/components/ui/badge'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const [deleteJobId, setDeleteJobId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{ 
        const filteredJobs = allAdminJobs && allAdminJobs.length >= 0 ? allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            }
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
        }) : [];
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])

    const handleDelete = async () => {
        if (!deleteJobId) return;
        try {
            setIsDeleting(true);
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${deleteJobId}`, { withCredentials: true });
            if(res.data.success){
                toast.success(res.data.message);
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete job");
        } finally {
            setIsDeleting(false);
            setDeleteJobId(null);
        }
    }

    if (!allAdminJobs || allAdminJobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] border border-dashed border-gray-300 rounded-lg bg-gray-50/50 mt-5">
                <div className="text-4xl mb-4 text-gray-400"><Briefcase className="w-12 h-12" /></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Posted Yet</h3>
                <p className="text-gray-500 mb-6">You haven't posted any jobs. Create your first job posting to start hiring.</p>
                <Button onClick={() => navigate("/admin/jobs/create")} className="bg-blue-600 hover:bg-blue-700">
                    Post a Job
                </Button>
            </div>
        )
    }

    return (
        <div className="border border-gray-200 rounded-lg shadow-sm mt-5 bg-white overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Locations</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                No jobs match your search.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filterJobs?.map((job) => (
                            <TableRow key={job._id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium text-gray-900">{job?.company?.name}</TableCell>
                                <TableCell className="text-gray-700">{job?.title}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {Array.isArray(job?.location) ? job.location.map((loc, idx) => (
                                            <Badge variant="secondary" key={idx} className="bg-blue-50 text-blue-700 font-normal hover:bg-blue-100">{loc}</Badge>
                                        )) : (
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-normal hover:bg-blue-100">{job?.location || "India"}</Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={job?.applications?.length > 0 ? "default" : "secondary"} className={job?.applications?.length > 0 ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}>
                                        {job?.applications?.length || 0}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-500">{job?.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-2" align="end">
                                            {job.applications && job.applications.length > 0 ? (
                                                <div className='flex items-center gap-2 w-full p-2 text-gray-400 cursor-not-allowed mb-1' title="This job can no longer be edited because candidates have already applied.">
                                                    <Edit2 className='w-4 h-4' />
                                                    <span>Edit (Locked)</span>
                                                </div>
                                            ) : (
                                                <div onClick={()=> navigate(`/admin/jobs/edit/${job._id}`)} className='flex items-center gap-2 w-full p-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors mb-1'>
                                                    <Edit2 className='w-4 h-4 text-gray-600' />
                                                    <span className="font-medium">Edit</span>
                                                </div>
                                            )}
                                            
                                            <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center gap-2 w-full p-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors mb-1'>
                                                <Eye className='w-4 h-4 text-blue-600'/>
                                                <span className="font-medium">Applicants</span>
                                            </div>

                                            <div onClick={() => setDeleteJobId(job._id)} className='flex items-center gap-2 w-full p-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-md transition-colors'>
                                                <Trash2 className='w-4 h-4'/>
                                                <span className="font-medium">Delete</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            
            <Dialog open={!!deleteJobId} onOpenChange={(open) => !open && setDeleteJobId(null)}>
                <DialogContent className="sm:max-w-md border-red-100">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-red-600 flex items-center gap-2">
                            <Trash2 className="w-5 h-5"/> Delete Job
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="font-semibold text-gray-900 mb-2">This action cannot be undone.</p>
                        <p className="text-sm text-gray-600 mb-3">Deleting this job will also remove all applications submitted for it.</p>
                    </div>
                    <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setDeleteJobId(null)}>Cancel</Button>
                        <Button variant="destructive" className="w-full sm:w-auto bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete Forever"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AdminJobsTable