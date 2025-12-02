import React, { useEffect } from 'react'
import { Button, Chip, Stack, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import { setSingleJob } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';


const JobDescription = () => {
  const isApplied=false
   const {singleJob} = useSelector(store=>store.job);
   const{user} = useSelector(store=>store.auth);
 const params = useParams();
 const jobId = params.id;


 const dispatch = useDispatch();
 useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    },[jobId,dispatch,user?._id])
  return (
        <Box maxWidth="1200px" mx="auto" my={10}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" fontWeight="bold">{singleJob?.title}</Typography>
          <Stack direction="row" spacing={1} mt={2}>
            <Chip label={`${singleJob?.position}Positions`} color="primary" />
            <Chip label={singleJob?.jobType} color="error" />
            <Chip label={`${singleJob?.salary} LPA`} color="secondary" />
          </Stack>
        </Box>
        <Button
          variant="contained"
          color="secondary"
        //   disabled={isApplied}
        //   onClick={isApplied ? null : applyJobHandler}
        >
          {isApplied ? 'Already Applied' : 'Apply Now'}
        </Button>
      </Box>

      <Typography variant="h6" mt={4} mb={2} borderBottom={1} borderColor="grey.300">Job Description</Typography>

      <Stack spacing={1}>
        <Typography><strong>Role:</strong>{singleJob?.title}</Typography>
        <Typography><strong>Location:</strong>{singleJob?.location}</Typography>
        <Typography><strong>{singleJob?.description}</strong></Typography>
        <Typography><strong>Experience:</strong> {singleJob?.experienceLevel} </Typography>
        <Typography><strong>Salary: {`${singleJob?.salary} LPA`} </strong> </Typography>
        <Typography><strong>Total Applicants:</strong>{singleJob?.applications?.length}</Typography>
        <Typography><strong>Posted Date:</strong>{singleJob?.createdAt.split("T")[0]}</Typography>
      </Stack>
    </Box>
  )
}

export default JobDescription


// import React from 'react'
// import { Button, Chip, Stack, Typography, Box } from '@mui/material';


// const JobDescription = () => {
//   return (
//         <Box maxWidth="1200px" mx="auto" my={10}>
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Box>
//           <Typography variant="h5" fontWeight="bold">Title</Typography>
//           <Stack direction="row" spacing={1} mt={2}>
//             <Chip label= "12Positions" color="primary" />
//             <Chip label="jobtype" color="error" />
//             <Chip label={`${singleJob?.salary} LPA`} color="secondary" />
//           </Stack>
//         </Box>
//         <Button
//           variant="contained"
//           color="secondary"
//           disabled={isApplied}
//           onClick={isApplied ? null : applyJobHandler}
//         >
//           {isApplied ? 'Already Applied' : 'Apply Now'}
//         </Button>
//       </Box>

//       <Typography variant="h6" mt={4} mb={2} borderBottom={1} borderColor="grey.300">Job Description</Typography>

//       <Stack spacing={1}>
//         <Typography><strong>Role:</strong> {singleJob?.title}</Typography>
//         <Typography><strong>Location:</strong> {singleJob?.location}</Typography>
//         <Typography><strong>Description:</strong> {singleJob?.description}</Typography>
//         <Typography><strong>Experience:</strong> {singleJob?.experience} yrs</Typography>
//         <Typography><strong>Salary:</strong> {singleJob?.salary} LPA</Typography>
//         <Typography><strong>Total Applicants:</strong> {singleJob?.applications?.length}</Typography>
//         <Typography><strong>Posted Date:</strong> {singleJob?.createdAt?.split("T")[0]}</Typography>
//       </Stack>
//     </Box>
//   )
// }

// export default JobDescription
