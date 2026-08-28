import React, { useEffect, useState } from 'react'
import Navbar from '../../components/shared/Navbar'
import { Button } from '../../components/ui/button'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // name is immutable, backend ignores it anyway, but we can exclude it here
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error updating company");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${params.id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Error deleting company");
        } finally {
            setLoading(false);
            setOpenDeleteDialog(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        })
    },[singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 px-4'>
                <form onSubmit={submitHandler} className='bg-white shadow-sm border border-gray-200 rounded-xl p-8'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-gray-100 mb-8 gap-4'>
                        <div className='flex items-center gap-5'>
                            <Button type="button" onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 font-semibold">
                                <ArrowLeft className="w-4 h-4"/>
                                <span>Back</span>
                            </Button>
                            <div>
                                <h1 className='font-bold text-2xl text-gray-900'>Company Setup</h1>
                                <p className='text-sm text-gray-500 mt-1'>Update your company details and logo.</p>
                            </div>
                        </div>
                        <Button type="button" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto" onClick={() => setOpenDeleteDialog(true)}>
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Delete Company
                        </Button>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className="col-span-1 md:col-span-2">
                            <Label className="text-gray-700 font-semibold text-base">Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                disabled
                                className="bg-gray-50 cursor-not-allowed mt-2 py-5 text-gray-500 border-gray-200"
                            />
                            <p className="text-xs text-amber-600 mt-2 font-medium">This field cannot be changed after registration.</p>
                        </div>
                        <div>
                            <Label className="text-gray-700 font-semibold text-base">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="mt-2 py-5 focus-visible:ring-blue-600"
                                placeholder="What does your company do?"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-semibold text-base">Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                className="mt-2 py-5 focus-visible:ring-blue-600"
                                placeholder="e.g. www.acmecorp.com"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-semibold text-base">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="mt-2 py-5 focus-visible:ring-blue-600"
                                placeholder="Headquarters or remote"
                            />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-semibold text-base">Company Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="mt-2 py-4 file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-md hover:file:bg-blue-100 cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-gray-100">
                        {loading ? (
                            <Button disabled className="w-full sm:w-auto bg-blue-600 text-white py-6 px-8 text-base">
                                <Loader2 className='mr-2 h-5 w-5 animate-spin' /> 
                                Saving changes...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 text-base">
                                Save Changes
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent className="sm:max-w-md border-red-100">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-red-600 flex items-center gap-2">
                            <Trash2 className="w-5 h-5"/> Delete Company
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="font-semibold text-gray-900 mb-2">This action cannot be undone.</p>
                        <p className="text-sm text-gray-600 mb-3">Deleting this company will permanently remove:</p>
                        <ul className="list-disc ml-5 mt-2 text-sm text-gray-600 space-y-1 bg-red-50 p-3 rounded-lg border border-red-100">
                            <li>The <strong>{input.name}</strong> Company profile</li>
                            <li>All active and closed <strong>Jobs</strong></li>
                            <li>All <strong>Applications</strong> related to those jobs</li>
                        </ul>
                    </div>
                    <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" className="w-full sm:w-auto bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={loading}>
                            {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                            Delete Forever
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CompanySetup