import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AppliedJobTable = ({ filterStatus = 'all' }) => {
    const navigate = useNavigate();
    const {allAppliedJobs} = useSelector(store=>store.job);

    const filteredJobs = allAppliedJobs.filter(job => {
        if (filterStatus === 'all') return true;
        return job.status === filterStatus;
    });

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filteredJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-slate-500 py-10">You haven't applied any job yet.</TableCell>
                            </TableRow>
                        ) : filteredJobs.map((appliedJob) => (
                            <TableRow 
                                key={appliedJob._id} 
                                onClick={() => navigate(`/description/${appliedJob.job?._id}`)}
                                className="cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right"><Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</Badge></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable