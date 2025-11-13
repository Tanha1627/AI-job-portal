import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { Avatar, AvatarImage } from './ui/avatar';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Job = () => {
  const navigate = useNavigate();
  const jobId="hsufkksl"
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
          <h1>Company Name</h1>
          <p>Bangladesh</p>
        </div>
        <div>
          <h2>Title</h2>
          <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing </p>
        </div>
        <div className='flex items-center gap-2 mt-4'>
      <Stack direction="row" spacing={1}>
      <Chip label="12 Positions" color="primary" variant="outlined" />
      <Chip label="Part Time" color="secondary" variant="outlined" />
      <Chip label="24LPA" color="success" variant="outlined" />
    </Stack>
        </div>
      

<Stack direction="row" spacing={2} mt={2}>
  <Button variant="outlined" onClick={() => navigate(`/description/${jobId}`)}>
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