import React, { useState, useEffect } from 'react'
import Navbar from '../../components/shared/Navbar'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react'

const EditJob = () => {
    const { id } = useParams();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salaryType: "Not Disclosed",
        salaryPeriod: "Yearly (LPA)",
        salaryMin: "",
        salaryMax: "",
        employmentType: "",
        workMode: "",
        jobType: "",
        experienceLevel: "",
        position: 0,
        companyId: ""
    });
    const [locations, setLocations] = useState([]);
    const [locationInput, setLocationInput] = useState("");
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
                if (res.data.success) {
                    const job = res.data.job;
                    setInput({
                        title: job.title || "",
                        description: job.description || "",
                        requirements: Array.isArray(job.requirements) ? job.requirements.join(',') : (job.requirements || ""),
                        salaryType: job.salaryType || "Not Disclosed",
                        salaryPeriod: job.salaryPeriod || "Yearly (LPA)",
                        salaryMin: job.salaryMin || "",
                        salaryMax: job.salaryMax || "",
                        employmentType: job.employmentType || "",
                        workMode: job.workMode || "",
                        jobType: job.jobType || "",
                        experienceLevel: job.experienceLevel || "",
                        position: job.position || 0,
                        companyId: job.company?._id || job.company || ""
                    });
                    setLocations(Array.isArray(job.location) ? job.location : [job.location]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchJob();
    }, [id]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const addLocation = () => {
        const trimmed = locationInput.trim();
        if (trimmed && !locations.includes(trimmed)) {
            setLocations([...locations, trimmed]);
            setLocationInput("");
        }
    };

    const removeLocation = (loc) => {
        setLocations(locations.filter(l => l !== loc));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if(!input.title?.trim()) return toast.error("Something is missing: Job Title");
        if(!input.description?.trim()) return toast.error("Something is missing: Description");
        if(!input.requirements?.trim()) return toast.error("Something is missing: Requirements");
        
        if(input.salaryType !== 'Not Disclosed') {
            if(input.salaryMin === "" || Number(input.salaryMin) < 1) return toast.error("Salary amount must be at least 1");
            if(input.salaryType === 'Range' && (input.salaryMax === "" || Number(input.salaryMax) <= Number(input.salaryMin))) {
                return toast.error("Max Salary must be greater than Min Salary");
            }
        }
        
        if(locations.length === 0) return toast.error("Something is missing: Please add at least one location");
        if(!input.employmentType) return toast.error("Something is missing: Employment Type");
        if(!input.workMode) return toast.error("Something is missing: Work Mode");
        if(!input.jobType) return toast.error("Something is missing: Job Type");
        if(!input.experienceLevel) return toast.error("Something is missing: Experience Level");
        if(input.position === "" || Number(input.position) < 1) return toast.error("Number of Positions must be at least 1");

        try {
            setLoading(true);
            const payload = { 
                ...input, 
                location: locations,
                companyId: input.companyId
            };
            const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, payload, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally{
            setLoading(false);
        }
    }

    const getSalaryLabel = (isMin) => {
        const prefix = isMin ? (input.salaryType === 'Range' ? 'Min' : 'Exact') : 'Max';
        if (input.salaryPeriod === 'Yearly (LPA)') return `${prefix} Amount (in Lakhs)`;
        if (input.salaryPeriod === 'Hourly') return `${prefix} Amount (/hr)`;
        return `${prefix} Amount (Exact ₹)`;
    }

    return (
        <div className="bg-[#EEF1F5] min-h-screen">
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 px-4'>
                <form onSubmit={submitHandler} className='bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 sm:p-8 relative overflow-hidden'>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-sky-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
                    <div className='flex items-center gap-5 mb-8 pb-8 border-b border-slate-100 relative z-10'>
                        <Button type="button" onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2 text-slate-600 font-semibold border-slate-200 hover:bg-slate-50">
                            <ArrowLeft className="w-4 h-4"/>
                            <span>Back</span>
                        </Button>
                        <div>
                            <h1 className="font-bold text-2xl text-slate-900">Edit Job</h1>
                            <p className='text-slate-500 mt-1'>Update the details for this job listing.</p>
                        </div>
                    </div>
                    
                    <div className="relative z-10 space-y-10">
                        {/* Basic Details Section */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm">1</span>
                                Basic Details
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <Label className="font-semibold text-slate-700">Job Title</Label>
                                    <Input
                                        type="text"
                                        name="title"
                                        value={input.title}
                                        onChange={changeEventHandler}
                                        className="mt-2 py-6 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                                        placeholder="e.g. Senior Frontend Engineer"
                                    />
                                </div>
                                <div>
                                    <Label className="font-semibold text-slate-700">Description</Label>
                                    <Input
                                        type="text"
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        className="mt-2 py-6 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                                        placeholder="Brief description of the role"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label className="font-semibold text-slate-700">Requirements</Label>
                                    <Input
                                        type="text"
                                        name="requirements"
                                        value={input.requirements}
                                        onChange={changeEventHandler}
                                        className="mt-2 py-6 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                                        placeholder="Comma-separated skills (e.g. React, Node, Typescript)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Salary Details Section */}
                        <div className="pt-8 border-t border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm">2</span>
                                Salary Details
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <Label className="font-semibold text-slate-700">Salary Disclosure</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={(value) => setInput({...input, salaryType: value})} value={input.salaryType}>
                                            <SelectTrigger className="w-full py-6 bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Select Salary Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Not Disclosed">Not Disclosed / Negotiable</SelectItem>
                                                    <SelectItem value="Fixed">Fixed Amount</SelectItem>
                                                    <SelectItem value="Range">Salary Range</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {input.salaryType !== 'Not Disclosed' && (
                                    <>
                                        <div>
                                            <Label className="font-semibold text-slate-700">Pay Period</Label>
                                            <div className="mt-2">
                                                <Select onValueChange={(value) => setInput({...input, salaryPeriod: value})} value={input.salaryPeriod}>
                                                    <SelectTrigger className="w-full py-6 bg-slate-50 border-slate-200">
                                                        <SelectValue placeholder="Select Period" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="Yearly (LPA)">Yearly (LPA)</SelectItem>
                                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                                            <SelectItem value="Hourly">Hourly</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <Label className="font-semibold text-slate-700">{getSalaryLabel(true)}</Label>
                                            <Input
                                                type="number"
                                                name="salaryMin"
                                                value={input.salaryMin}
                                                onChange={changeEventHandler}
                                                className="mt-2 py-6 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                                                placeholder={input.salaryPeriod === 'Yearly (LPA)' ? "e.g. 12" : "e.g. 50000"}
                                            />
                                        </div>

                                        {input.salaryType === 'Range' && (
                                            <div>
                                                <Label className="font-semibold text-slate-700">{getSalaryLabel(false)}</Label>
                                                <Input
                                                    type="number"
                                                    name="salaryMax"
                                                    value={input.salaryMax}
                                                    onChange={changeEventHandler}
                                                    className="mt-2 py-6 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                                                    placeholder={input.salaryPeriod === 'Yearly (LPA)' ? "e.g. 15" : "e.g. 70000"}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Location & Details Section */}
                        <div className="pt-8 border-t border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm">3</span>
                                Role Details
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                                <div className="col-span-1 md:col-span-2">
                                    <Label className="font-semibold text-slate-700">Locations</Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            type="text"
                                            value={locationInput}
                                            onChange={(e) => setLocationInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLocation(); } }}
                                            className="py-6 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                                            placeholder="Type a city and press Enter or click Add"
                                        />
                                        <Button type="button" onClick={addLocation} variant="outline" className="flex items-center gap-1 shrink-0 py-6 border-slate-200">
                                            <Plus className="w-4 h-4"/> Add
                                        </Button>
                                    </div>
                                    {locations.length === 0 && (
                                        <p className="text-xs text-amber-600 mt-2">At least one location is required.</p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {locations.map((loc, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                                                <span>{loc}</span>
                                                <button type="button" onClick={() => removeLocation(loc)} className="text-blue-400 hover:text-red-500 transition-colors">
                                                    <X className="w-3.5 h-3.5"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="font-semibold text-slate-700">Employment Type</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={(value) => setInput({...input, employmentType: value})} value={input.employmentType}>
                                            <SelectTrigger className="w-full py-6 bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Select Employment Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Permanent">Permanent</SelectItem>
                                                    <SelectItem value="Internship">Internship</SelectItem>
                                                    <SelectItem value="Contract">Contract</SelectItem>
                                                    <SelectItem value="Freelance">Freelance</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold text-slate-700">Job Type (Schedule)</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={(value) => setInput({...input, jobType: value})} value={input.jobType}>
                                            <SelectTrigger className="w-full py-6 bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Select Job Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold text-slate-700">Work Mode (Location)</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={(value) => setInput({...input, workMode: value})} value={input.workMode}>
                                            <SelectTrigger className="w-full py-6 bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Select Work Mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Remote">Remote</SelectItem>
                                                    <SelectItem value="On-site">On-site</SelectItem>
                                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold text-slate-700">Experience Required</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={(value) => setInput({...input, experienceLevel: value})} value={input.experienceLevel}>
                                            <SelectTrigger className="w-full py-6 bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Select Experience Level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Fresher (0 Years)">Fresher (0 Years)</SelectItem>
                                                    <SelectItem value="1 - 2 Years">1 - 2 Years</SelectItem>
                                                    <SelectItem value="2 - 5 Years">2 - 5 Years</SelectItem>
                                                    <SelectItem value="5 - 10 Years">5 - 10 Years</SelectItem>
                                                    <SelectItem value="10+ Years">10+ Years</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label className="font-semibold text-slate-700">No. of Positions</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        name="position"
                                        value={input.position}
                                        onChange={changeEventHandler}
                                        className="mt-2 py-6 bg-slate-50 border-slate-200 focus-visible:ring-blue-600"
                                        placeholder="e.g. 2"
                                    />
                                </div>

                            </div>
                        </div>

                    </div> 
                    
                    <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-4 relative z-10">
                        {
                            loading ? (
                                <Button disabled className="w-full sm:w-auto bg-blue-600 text-white py-6 px-8 text-base"> 
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' /> 
                                    Updating... 
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 text-base">
                                    Update Job
                                </Button>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditJob
