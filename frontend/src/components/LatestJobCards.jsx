import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage } from './ui/avatar'
import { Users, Banknote, Clock, Laptop, Briefcase, GraduationCap } from 'lucide-react'
import { formatSalary } from '@/utils/constant'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-6 rounded-xl shadow-sm bg-white border border-slate-300 hover:shadow-md hover:border-slate-400 transition-all cursor-pointer h-full flex flex-col justify-between group'>
            <div>
                <div className='flex items-center gap-4 mb-4'>
                    <div className="h-12 w-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1 group-hover:border-blue-200 transition-colors">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={job?.company?.logo} className="object-contain" />
                        </Avatar>
                    </div>
                    <div>
                        <h1 className='font-semibold text-lg text-slate-900'>{job?.company?.name}</h1>
                        <p className='text-sm text-slate-500'>
                            {Array.isArray(job?.location) ? job.location.join(", ") : (job?.location || "Not specified")}
                        </p>
                    </div>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2 text-slate-900 group-hover:text-blue-700 transition-colors'>{job?.title}</h1>
                    <p className='text-sm text-slate-600 line-clamp-2 leading-relaxed'>{job?.description}</p>
                </div>
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-6'>
                <Badge className='flex items-center text-blue-700 bg-blue-50 hover:bg-blue-100 border-transparent font-semibold py-1 px-3' variant="outline">
                    <Users size={14} className="mr-1.5" />
                    {job?.position > 0 ? `${job.position} Positions` : 'Multiple Positions'}
                </Badge>
                
                {job?.employmentType && (
                    <Badge className='flex items-center text-purple-700 bg-purple-50 hover:bg-purple-100 border-transparent font-semibold py-1 px-3' variant="outline">
                        {job.employmentType.toLowerCase() === 'internship' ? <GraduationCap size={14} className="mr-1.5" /> : <Briefcase size={14} className="mr-1.5" />}
                        {job.employmentType}
                    </Badge>
                )}
                
                {job?.workMode && (
                    <Badge className='flex items-center text-orange-700 bg-orange-50 hover:bg-orange-100 border-transparent font-semibold py-1 px-3' variant="outline">
                        <Laptop size={14} className="mr-1.5" />
                        {job.workMode}
                    </Badge>
                )}

                <Badge className='flex items-center text-slate-700 bg-slate-200 hover:bg-slate-300 border-transparent font-semibold py-1 px-3' variant="outline">
                    <Clock size={14} className="mr-1.5" />
                    {job?.jobType || 'Full-time'}
                </Badge>

                <Badge className='flex items-center text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-transparent font-semibold py-1 px-3' variant="outline">
                    <Banknote size={14} className="mr-1.5" />
                    {formatSalary(job)}
                </Badge>
            </div>
        </div>
    )
}

export default LatestJobCards