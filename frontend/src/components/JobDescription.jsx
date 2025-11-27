import React from 'react'
import { Button, Chip, Stack, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import useGetSingleJob from '@/hooks/useGetSingleJob';


const JobDescription = () => {
  const isApplied=false
 const params = useParams();
 const jobId = params.id;

 useGetSingleJob(jobId);
  return (
        <Box maxWidth="1200px" mx="auto" my={10}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" fontWeight="bold">Title</Typography>
          <Stack direction="row" spacing={1} mt={2}>
            <Chip label= "12Positions" color="primary" />
            <Chip label="jobtype" color="error" />
            <Chip label="13 LPA" color="secondary" />
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
        <Typography><strong>Role:</strong> Title</Typography>
        <Typography><strong>Location:</strong> Location</Typography>
        <Typography><strong>Description:</strong>description Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae, atque voluptatibus. Eaque praesentium minus ex, officiis reprehenderit ut, tenetur tempora obcaecati error cumque voluptas itaque commodi, corporis repellendus. Saepe, consequuntur?</Typography>
        <Typography><strong>Experience:</strong> 2years </Typography>
        <Typography><strong>Salary:</strong> 3 LPA</Typography>
        <Typography><strong>Total Applicants:</strong> 4</Typography>
        <Typography><strong>Posted Date:</strong>12-04-2025</Typography>
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
