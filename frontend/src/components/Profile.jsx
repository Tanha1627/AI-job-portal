import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import  { useState } from 'react';
import { useSelector } from 'react-redux';



// const Skills =["Html", "css", "javascript"]

const Profile = () => {
   const [open, setOpen] = useState(false);
   const {user} = useSelector(store=>store.auth);

  const isResume = true
  return (
    <div>
      <div className="mx-auto pr-150 bg-white border border-gray-200 rounded-2xl p-8">
      {/* Flex container with space between left (avatar+name) and right (pen) */}
      <div className="flex justify-between items-center">
        
        {/* Left section: avatar and name */}
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" 
              alt="profile" 
            />
          </Avatar>
          <div>
            <h2 className="font-medium text-xl">{user?.fullname}</h2>
            <p>{user?.profile?.bio}</p>
          </div>

           <Button 
          variant="outline" 
          className="relative left-120 hover:bg-white-200 text-white rounded-full p-3"
            onClick={() => setOpen(true)}
        >
          <Pen size={18} />
        </Button>
        </div>
        </div>
         <div>
          <div className='flex items-center gap-3 my-2'>
          <Mail/>
          <span>{user?.email}</span>
          </div>
           
          <div className='flex items-center gap-3 my-2'>
          <Contact/>
          <span>{user?.phoneNumber}</span>
        </div>
      </div>

      <div>
        <div>
          <h3>Skills</h3>
        {user?.profile?.skills.length > 0 && (
  <Stack direction="row" spacing={1} mt={1}>
    {user?.profile?.skills.map((skill, index) => (
      <Chip key={index} label={skill} color="primary" variant="outlined" />
    ))}
  </Stack>
)}
 </div>
 <div className='grid w-full max-w-sm items-center gap-1.5'>
  {
    isResume ? <a target='blank' href={user?.profile?.resumeFileUrl}>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
  }
 </div>
  </div>
  </div>
      <div>
        <h1>Applied Jobs</h1>
        <AppliedJobTable/>
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen}/>
    </div>
  
  )
}

export default Profile
