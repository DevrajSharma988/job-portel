import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills || [],
        file: user?.profile?.resume || ""
    });
    const [newSkill, setNewSkill] = useState("");
    const dispatch = useDispatch();

    const addSkill = () => {
        if (newSkill.trim()) {
            setInput({ ...input, skills: [...input.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const removeSkill = (indexToRemove) => {
        setInput({ ...input, skills: input.skills.filter((_, index) => index !== indexToRemove) });
    };

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        if (user?.role === 'applicant') {
            formData.append("skills", JSON.stringify(input.skills));
        }
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
        setOpen(false);
        console.log(input);
    }



    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    className="col-span-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-start gap-4'>
                                <Label htmlFor="bio" className="text-right mt-3">Bio</Label>
                                <div className="col-span-3 relative pb-6">
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={input.bio}
                                        maxLength={300}
                                        onChange={(e) => {
                                            changeEventHandler(e);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = (e.target.scrollHeight) + 'px';
                                        }}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden min-h-[80px]"
                                    />
                                    <span className="text-xs text-gray-500 absolute bottom-0 right-1">
                                        {input.bio?.length || 0} / 300
                                    </span>
                                </div>
                            </div>
                            {user?.role === 'applicant' ? (
                                <>
                                    <div className='grid grid-cols-4 items-start gap-4'>
                                        <Label htmlFor="skills" className="text-right mt-3">Skills</Label>
                                        <div className="col-span-3">
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    id="skills"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    placeholder="Add a skill"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addSkill();
                                                        }
                                                    }}
                                                />
                                                <Button type="button" onClick={addSkill} className="shrink-0 bg-[#0f172a] hover:bg-[#1e293b] text-white">
                                                    + Add
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {input.skills.map((skill, index) => (
                                                    <div key={index} className="flex items-center gap-1 bg-gray-100 text-sm px-3 py-1 rounded-full">
                                                        <span>{skill}</span>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeSkill(index)}
                                                            className="text-gray-500 hover:text-red-500 font-bold ml-1 focus:outline-none"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="resumeFile" className="text-right">Resume</Label>
                                        <Input
                                            id="resumeFile"
                                            name="file"
                                            type="file"
                                            accept="application/pdf"
                                            onChange={fileChangeHandler}
                                            className="col-span-3 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                        />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="photoFile" className="text-right">Profile Photo</Label>
                                        <Input
                                            id="photoFile"
                                            name="file"
                                            type="file"
                                            accept="image/jpeg, image/png, image/jpg"
                                            onChange={fileChangeHandler}
                                            className="col-span-3 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor="file" className="text-right">Profile Photo</Label>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="image/jpeg, image/png, image/jpg"
                                        onChange={fileChangeHandler}
                                        className="col-span-3 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog