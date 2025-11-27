import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { Avatar, AvatarImage } from './ui/avatar';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Job = ({job}) => {
  const navigate = useNavigate();

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-200'>
      <div className='flex items-center justify-between'>
        <p>2 Days Ago</p>
        <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
      </div>

      <div>
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src="https://png.pngtree.com/png-vector/20190304/ourmid/pngtree-growth-business-company-logo-png-image_728232.jpg" />

          </Avatar>
        </Button>

        <div>
         <h1>{job?.companyName}</h1>
          <p>{job?.location}</p>
        </div>
        <div>
           <h2>{job?.title}</h2>
          <p className='text-sm'>{job?.description}</p>
        </div>
        <div className='flex items-center gap-2 mt-4'>
       <Stack direction="row" spacing={1} className="mt-4">
          <Chip label={`${job?.position} Positions`} color="primary" variant="outlined" />
          <Chip label={job?.jobType} color="secondary" variant="outlined" />
          <Chip label={`${job?.salary}LPA`} color="success" variant="outlined" />
        </Stack>

        </div>
      

<Stack direction="row" spacing={2} mt={2}>
  <Button variant="outlined" onClick={() => navigate(`/description/${job?._id}`)}>
    Details
  </Button>

  <Button variant="contained" sx={{ backgroundColor: '#d946ef' }}>
    Save For Later
  </Button>
</Stack>

      </div>

    </div>
  )
}

export default Job