import React, { useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, Plus, X, ArrowLeft } from 'lucide-react'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        employmentType: "",
        workMode: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [locations, setLocations] = useState([]);
    const [locationInput, setLocationInput] = useState("");
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
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

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company)=> company.name.toLowerCase() === value);
        setInput({...input, companyId:selectedCompany._id});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if(locations.length === 0) {
            toast.error("Please add at least one location.");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, { ...input, location: locations },{
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

    return (
        <div>
            <Navbar />
            <div className='max-w-5xl mx-auto my-10 px-4'>
                <Button onClick={() => navigate(-1)} variant="ghost" className="flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-5 h-5"/>
                    Back
                </Button>
                <div className='bg-white border border-gray-200 shadow-sm rounded-xl p-8'>
                    <div className='mb-8'>
                        <h1 className='font-bold text-2xl text-gray-900'>Post a New Job</h1>
                        <p className='text-gray-500 mt-1'>Fill in the details below to create a new job listing.</p>
                    </div>
                    <form onSubmit={submitHandler}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <Label className="font-semibold text-gray-700">Job Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    className="mt-2 py-5 focus-visible:ring-blue-600"
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                            </div>
                            <div>
                                <Label className="font-semibold text-gray-700">Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    className="mt-2 py-5 focus-visible:ring-blue-600"
                                    placeholder="Brief description of the role"
                                />
                            </div>
                            <div>
                                <Label className="font-semibold text-gray-700">Requirements</Label>
                                <Input
                                    type="text"
                                    name="requirements"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    className="mt-2 py-5 focus-visible:ring-blue-600"
                                    placeholder="Comma-separated skills (e.g. React, Node)"
                                />
                            </div>
                            <div>
                                <Label className="font-semibold text-gray-700">Salary (LPA)</Label>
                                <Input
                                    type="number"
                                    name="salary"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    className="mt-2 py-5 focus-visible:ring-blue-600"
                                    placeholder="e.g. 12"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <Label className="font-semibold text-gray-700">Locations</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        type="text"
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLocation(); } }}
                                        className="py-5 focus-visible:ring-blue-600"
                                        placeholder="Type a city and press Enter or click Add"
                                    />
                                    <Button type="button" onClick={addLocation} variant="outline" className="flex items-center gap-1 shrink-0 py-5">
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
                                <Label className="font-semibold text-gray-700">Employment Type</Label>
                                <div className="mt-2">
                                    <Select onValueChange={(value) => setInput({...input, employmentType: value})}>
                                        <SelectTrigger className="w-full py-5">
                                            <SelectValue placeholder="Select Employment Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Permanent">Permanent</SelectItem>
                                                <SelectItem value="Internship">Internship</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label className="font-semibold text-gray-700">Work Mode</Label>
                                <div className="mt-2">
                                    <Select onValueChange={(value) => setInput({...input, workMode: value})}>
                                        <SelectTrigger className="w-full py-5">
                                            <SelectValue placeholder="Select Work Mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Full-time">Full-time</SelectItem>
                                                <SelectItem value="Part-time">Part-time</SelectItem>
                                                <SelectItem value="Remote">Remote</SelectItem>
                                                <SelectItem value="On-site">On-site</SelectItem>
                                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label className="font-semibold text-gray-700">Experience Level (Years)</Label>
                                <Input
                                    type="number"
                                    name="experience"
                                    value={input.experience}
                                    onChange={changeEventHandler}
                                    className="mt-2 py-5 focus-visible:ring-blue-600"
                                    placeholder="e.g. 3"
                                />
                            </div>
                            <div>
                                <Label className="font-semibold text-gray-700">No. of Positions</Label>
                                <Input
                                    type="number"
                                    name="position"
                                    value={input.position}
                                    onChange={changeEventHandler}
                                    className="mt-2 py-5 focus-visible:ring-blue-600"
                                    placeholder="e.g. 2"
                                />
                            </div>
                            {companies.length > 0 && (
                                <div>
                                    <Label className="font-semibold text-gray-700">Company</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={selectChangeHandler}>
                                            <SelectTrigger className="w-full py-5">
                                                <SelectValue placeholder="Select a Company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {companies.map((company) => (
                                                        <SelectItem key={company._id} value={company?.name?.toLowerCase()}>{company.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                            {loading ? (
                                <Button disabled className="w-full sm:w-auto bg-blue-600 text-white py-6 px-8 text-base">
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' /> 
                                    Posting...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 text-base">
                                    Post Job
                                </Button>
                            )}
                            {companies.length === 0 && (
                                <p className='text-sm text-red-600 font-medium'>
                                    ⚠️ Please register a company first before posting a job.
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostJob