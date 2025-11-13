import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';



const UpdateProfileDialog = ({open, setOpen}) => {
    const [loading, setloading] = useState(false);
    const {user} =useSelector(store=>store.auth);
    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        file: user?.profile?.resumeFileUrl || ""
    });

    const dispatch = useDispatch();



       const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

      const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) =>{
      e.preventDefault();
       const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);

         if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setloading(true);
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
            setloading(false);
        }
        setOpen(false);

      console.log(input);
    }

  return (
    <div>
    <Dialog open={open} onClose={() => setOpen(false)}>

        <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2 }}>
    <DialogTitle sx={{ p: 0, fontWeight: 'bold' }}>Update Profile</DialogTitle>
    <IconButton
      aria-label="close"
      onClick={() => setOpen(false)}
      sx={{ color: (theme) => theme.palette.grey[500] }}
    >
      <CloseIcon />
    </IconButton>
  </Box>

            <form onSubmit={submitHandler}>
                <div className='grid  gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="name" className="text-right">Name</Label>
                   
                   <Input
                   id="name"
                   name="name"
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
                   value={input.email}
                    onChange={changeEventHandler}
                   className="col-span-3"
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
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="bio" className="text-right">Bio</Label>
                   
                   <Input
                   id="bio"
                   name="bio"
                   value={input.bio}
                    onChange={changeEventHandler}
                   className="col-span-3"
                   />
                    </div>
                     <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="skills" className="text-right">Skills</Label>
                   
                   <Input
                   id="skills"
                   name="skills"
                   value={input.skills}
                    onChange={changeEventHandler}
                   className="col-span-3"
                   />
                    </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor="file" className="text-right">resume</Label>
                   
                   <Input
                   id="file"
                   name="file"
                   type="file"
                   accept="application/pdf"
                   onChange={fileChangeHandler}
                   className="col-span-3"
                   />
                    </div>
                 
                 
                <div>
                </div>
                </div>
                 <DialogActions>
          {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                    }
        </DialogActions>
            </form>
        </DialogContent>
       
      </Dialog>
    </div>
  )
}

export default UpdateProfileDialog
