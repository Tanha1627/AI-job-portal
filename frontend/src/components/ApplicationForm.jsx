import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';

const ApplicationForm = ({ open, setOpen, jobId }) => {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        coverLetter: "",
        resume: null
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Please upload a PDF file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            setInput({ ...input, resume: file });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!input.fullname || !input.email || !input.phoneNumber || !input.coverLetter || !input.resume) {
            toast.error('Please fill all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
            toast.error('Please enter a valid email');
            return;
        }

        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(input.phoneNumber)) {
            toast.error('Please enter a valid phone number (10-15 digits)');
            return;
        }

        if (input.coverLetter.length < 50) {
            toast.error('Cover letter should be at least 50 characters');
            return;
        }

        if (input.coverLetter.length > 2000) {
            toast.error('Cover letter should not exceed 2000 characters');
            return;
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("coverLetter", input.coverLetter);
        formData.append("file", input.resume);

        try {
            setLoading(true);
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`, 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );
            
            if (res.data.success) {
                toast.success(res.data.message);
                setOpen(false);
                setInput({
                    fullname: "",
                    email: "",
                    phoneNumber: "",
                    coverLetter: "",
                    resume: null
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2 }}>
                    <DialogTitle sx={{ p: 0, fontWeight: 'bold' }}>Job Application</DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                        sx={{ color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="fullname" className="text-right">Full Name *</Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                placeholder="John Doe"
                                className="col-span-3"
                            />
                        </div>

                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="email" className="text-right">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="john@example.com"
                                className="col-span-3"
                            />
                        </div>

                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="phoneNumber" className="text-right">Phone Number *</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                placeholder="1234567890"
                                className="col-span-3"
                            />
                        </div>

                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="resume" className="text-right">Resume (PDF) *</Label>
                            <div className="col-span-3">
                                <Input
                                    id="resume"
                                    name="resume"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                />
                                {input.resume && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Selected: {input.resume.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='grid grid-cols-4 items-start gap-4'>
                            <Label htmlFor="coverLetter" className="text-right pt-2">Cover Letter *</Label>
                            <div className="col-span-3">
                                <textarea
                                    id="coverLetter"
                                    name="coverLetter"
                                    value={input.coverLetter}
                                    onChange={changeEventHandler}
                                    placeholder="Write your cover letter here... (50-2000 characters)"
                                    className="w-full min-h-[200px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    maxLength={2000}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {input.coverLetter.length}/2000 characters
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogActions>
                        <Button onClick={() => setOpen(false)} variant="outlined">
                            Cancel
                        </Button>
                        {loading ? (
                            <Button disabled className="w-32">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                Submitting...
                            </Button>
                        ) : (
                            <Button type="submit" variant="contained" className="w-32">
                                Submit Application
                            </Button>
                        )}
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationForm;
