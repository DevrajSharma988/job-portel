import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useDispatch } from 'react-redux'
import { setFilters } from '@/redux/jobSlice'
import { X, Plus } from 'lucide-react'

const filterData = [
    {
        filterType: "Employment Type",
        field: "employmentTypes",
        array: ["Permanent", "Internship", "Contract", "Freelance"]
    },
    {
        filterType: "Job Type",
        field: "jobTypes",
        array: ["Full-time", "Part-time"]
    },
    {
        filterType: "Work Mode",
        field: "workModes",
        array: ["Remote", "On-site", "Hybrid"]
    },
    {
        filterType: "Salary Range",
        field: "salaryRanges",
        array: ["0-3 LPA", "3-5 LPA", "5-10 LPA", "10+ LPA"]
    }
];

const FilterCard = () => {
    const dispatch = useDispatch();
    
    const [selectedFilters, setSelectedFilters] = useState({
        locations: [],
        industries: [],
        employmentTypes: [],
        jobTypes: [],
        workModes: [],
        salaryRanges: []
    });

    const [roleInput, setRoleInput] = useState("");
    const [locationInput, setLocationInput] = useState("");

    const changeHandler = (field, value) => {
        setSelectedFilters(prev => {
            const currentSelected = prev[field];
            if (currentSelected.includes(value)) {
                return { ...prev, [field]: currentSelected.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...currentSelected, value] };
            }
        });
    };

    const addRoleHandler = (e) => {
        if (e) e.preventDefault();
        const trimmed = roleInput.trim();
        if (trimmed && !selectedFilters.industries.includes(trimmed)) {
            setSelectedFilters(prev => ({
                ...prev,
                industries: [...prev.industries, trimmed]
            }));
            setRoleInput("");
        }
    };

    const addLocationHandler = (e) => {
        if (e) e.preventDefault();
        const trimmed = locationInput.trim();
        if (trimmed && !selectedFilters.locations.includes(trimmed)) {
            setSelectedFilters(prev => ({
                ...prev,
                locations: [...prev.locations, trimmed]
            }));
            setLocationInput("");
        }
    };

    const removeRoleHandler = (role) => {
        setSelectedFilters(prev => ({
            ...prev,
            industries: prev.industries.filter(item => item !== role)
        }));
    };

    const removeLocationHandler = (location) => {
        setSelectedFilters(prev => ({
            ...prev,
            locations: prev.locations.filter(item => item !== location)
        }));
    };

    const clearAll = () => {
        setSelectedFilters({
            locations: [],
            industries: [],
            employmentTypes: [],
            jobTypes: [],
            workModes: [],
            salaryRanges: []
        });
        setRoleInput("");
        setLocationInput("");
    };

    useEffect(() => {
        dispatch(setFilters(selectedFilters));
    }, [selectedFilters, dispatch]);

    return (
        <div className='w-full bg-transparent'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='font-bold text-lg text-gray-900'>Filter Jobs</h1>
                <Button variant="ghost" size="sm" onClick={clearAll} className='text-sm text-blue-600 hover:text-blue-800 h-auto p-1'>
                    Clear All
                </Button>
            </div>
            <hr className='mb-4 border-gray-100' />
            
            <div className="space-y-6">
                
                {/* Dynamic Location Search */}
                <div className="space-y-3">
                    <h2 className='font-semibold text-base text-gray-800'>Location</h2>
                    <form onSubmit={addLocationHandler} className="flex gap-2">
                        <Input 
                            type="text" 
                            placeholder="e.g. Delhi, Remote..." 
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            className="h-9 text-sm"
                        />
                        <Button type="submit" size="sm" variant="outline" className="h-9 px-2">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </form>
                    {selectedFilters.locations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedFilters.locations.map((loc, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-md text-xs font-medium">
                                    <span>{loc}</span>
                                    <button onClick={() => removeLocationHandler(loc)} className="text-blue-400 hover:text-red-500 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Dynamic Role Search */}
                <div className="space-y-3">
                    <h2 className='font-semibold text-base text-gray-800'>Industry / Role</h2>
                    <form onSubmit={addRoleHandler} className="flex gap-2">
                        <Input 
                            type="text" 
                            placeholder="e.g. Marketing, React..." 
                            value={roleInput}
                            onChange={(e) => setRoleInput(e.target.value)}
                            className="h-9 text-sm"
                        />
                        <Button type="submit" size="sm" variant="outline" className="h-9 px-2">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </form>
                    {selectedFilters.industries.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedFilters.industries.map((role, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-md text-xs font-medium">
                                    <span>{role}</span>
                                    <button onClick={() => removeRoleHandler(role)} className="text-blue-400 hover:text-red-500 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {filterData.map((data, index) => (
                    <div key={index} className="space-y-3">
                        <h2 className='font-semibold text-base text-gray-800'>{data.filterType}</h2>
                        <div className="flex flex-col gap-2">
                            {data.array.map((item, idx) => {
                                const itemId = `id${index}-${idx}`;
                                const isChecked = selectedFilters[data.field].includes(item);
                                return (
                                    <div key={itemId} className='flex items-center space-x-3'>
                                        <input 
                                            type="checkbox" 
                                            id={itemId} 
                                            checked={isChecked}
                                            onChange={() => changeHandler(data.field, item)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer" 
                                        />
                                        <Label htmlFor={itemId} className={`cursor-pointer text-sm font-medium ${isChecked ? 'text-blue-700' : 'text-gray-600'}`}>
                                            {item}
                                        </Label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FilterCard