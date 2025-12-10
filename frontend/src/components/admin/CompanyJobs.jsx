import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Stack,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Visibility,
  Work,
  LocationOn,
  AttachMoney,
  CalendarToday
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from "react-redux";

import { setCompanyJobs, setLoading, setError } from "@/redux/companyJobSlice.js"
import { useSelector } from "react-redux";

const CompanyJobs = () => {
  const { id: companyId } = useParams();
  const navigate = useNavigate();
  const dispatch= useDispatch();


  
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const companyJobs = useSelector(state => state.companyJob.jobs);

  // Fetch company details and jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
      

         const jobsRes = await axios.get(
          `${JOB_API_END_POINT}/company/${companyId}`,
          { withCredentials: true }
        );
        
        if (jobsRes.data.success) {
          setJobs(jobsRes.data.jobs);
          dispatch(setCompanyJobs(jobsRes.data.jobs));
        }
        
      } catch (error) {
        // console.error('Error fetching data:', error);
        toast.error('Failed to load company jobs');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchData();
    }
  }, [companyId, dispatch]);

  // const handleDeleteJob = async (jobId) => {
  //   if (!window.confirm('Are you sure you want to delete this job?')) return;

  //   try {
  //     const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
  //       withCredentials: true
  //     });
      
  //     if (res.data.success) {
  //       setJobs(jobs.filter(job => job._id !== jobId));
  //       toast.success('Job deleted successfully');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting job:', error);
  //     toast.error('Failed to delete job');
  //   }
  // };

  const handleCreateJob = () => {
    // Navigate to job creation page with company ID
    navigate(`/admin/jobs/create`, { state: { companyId } });
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/admin/companies')}
        sx={{ mb: 2 }}
      >
        Back to Companies
      </Button>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {company?.name || 'Company'} - Jobs
          </Typography>
          <Typography color="text.secondary">
            Manage all jobs for this company
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
          onClick={handleCreateJob}
        >
          Create New Job
        </Button>
      </Box>

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {companyJobs.length > 0 ? (
          companyJobs.map((job) => (
            <Grid item xs={12} md={6} key={job._id}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: '0.3s' }}>
                <CardContent>
                  {/* Job Title and Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {job.title}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        // onClick={() => handleDeleteJob(job._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Job Details */}
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Work fontSize="small" color="action" />
                      <Typography variant="body2">{job.position} Position(s)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2">{job.location}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney fontSize="small" color="action" />
                      <Typography variant="body2">{job.salary} LPA</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">
                        Posted: {job.createdAt?.split('T')[0]}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Job Tags */}
                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Chip label={job.jobType} size="small" color="primary" />
                    <Chip label={job.experienceLevel} size="small" />
                    <Chip
                      label={`${job.applications?.length || 0} Application(s)`}
                      size="small"
                      color="secondary"
                    />
                  </Stack>

                  {/* Description */}


                  <Box 
  sx={{ 
    mb: 2, 
    p: 1, 
    border: '1px solid #ddd', 
    borderRadius: 1, 
    maxHeight: 100, // adjust height as needed
    overflowY: 'auto', 
    backgroundColor: '#f9f9f9' 
  }}
>
  <Typography variant="body2" color="text.secondary">
    {job.description}
  </Typography>
</Box>
                  {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {job.description?.substring(0, 100)}
                    {job.description?.length > 100 ? '...' : ''}
                  </Typography> */}

                  {/* View Applications Button */}
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/admin/jobs/${job._id}/applications`)}
                  >
                    View Applications ({job.applications?.length || 0})
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No jobs posted yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                Click "Create New Job" to post your first job for {company?.name}
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={handleCreateJob}
              >
                Create Job
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CompanyJobs;