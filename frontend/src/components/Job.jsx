
import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { Avatar, AvatarImage } from './ui/avatar';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };


          
const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
};
  return (
    <div className="p-4 rounded-lg shadow-md bg-white border border-gray-200 flex flex-col justify-between h-[380px] ">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <Typography variant="caption" color="text.secondary">
          {daysAgoFunction(job?.createdAt) === 0
            ? 'Today'
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </Typography>
        <Button variant="outlined" size="small">
          <Bookmark />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar>
          <AvatarImage src="https://png.pngtree.com/png-vector/20190304/ourmid/pngtree-growth-business-company-logo-png-image_728232.jpg" />
        </Avatar>
        <div>
          <Typography variant="subtitle1" fontWeight={600}>
            {job?.companyName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {job?.location}
          </Typography>
        </div>
      </div>

      {/* Job Title & Description */}
      <div className="mb-3 flex-1">
        <Typography
          variant="subtitle1"
          noWrap
          title={job?.title}
          sx={{ fontWeight: 600 }}
        >
          {job?.title}
        </Typography>
<div className='w-[500px]'>
  


<Typography variant="body2" title={job?.description}>
  {truncateText(job?.description, 50)}
</Typography>
</div>
      </div>

      {/* Chips */}
      <Stack direction="row" spacing={1} mb={2}>
        <Chip label={`${job?.position} Positions`} color="primary" variant="outlined" size="small" />
        <Chip label={job?.jobType} color="secondary" variant="outlined" size="small" />
        <Chip label={`${job?.salary} LPA`} color="success" variant="outlined" size="small" />
      </Stack>

      {/* Buttons */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          Details
        </Button>
        <Button variant="contained" size="small" sx={{ backgroundColor: '#d946ef' }}>
          Save For Later
        </Button>
      </Stack>
    </div>
  );
};

export default Job;
