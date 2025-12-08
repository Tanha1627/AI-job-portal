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
  Paper
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
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import JobFormDialog from '@/components/admin/JobFormDialog';
import { JOB_API_END_POINT } from '@/utils/constant';

const CompanyJobs = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch company details and jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch company details
        const companyRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/company/get/${companyId}`,
          { withCredentials: true }
        );
        setCompany(companyRes.data.company);

        // Fetch jobs for this company
        const jobsRes = await axios.get(
          `${JOB_API_END_POINT}/get?companyId=${companyId}`,
          { withCredentials: true }
        );
        setJobs(jobsRes.data.jobs || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true
      });
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        // Update existing job
        const res = await axios.put(
          `${JOB_API_END_POINT}/update/${editingJob._id}`,
          jobData,
          { withCredentials: true }
        );
        setJobs(jobs.map(j => j._id === editingJob._id ? res.data.job : j));
      } else {
        // Create new job
        const res = await axios.post(
          `${JOB_API_END_POINT}/post`,
          { ...jobData, companyId },
          { withCredentials: true }
        );
        setJobs([...jobs, res.data.job]);
      }
      setOpenJobDialog(false);
      setEditingJob(null);
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job');
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
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
            {company?.name} - Jobs
          </Typography>
          <Typography color="text.secondary">
            Manage all jobs for this company
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
          onClick={() => {
            setEditingJob(null);
            setOpenJobDialog(true);
          }}
        >
          Create New Job
        </Button>
      </Box>

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
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
                        onClick={() => {
                          setEditingJob(job);
                          setOpenJobDialog(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Job Details */}
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Work fontSize="small" color="action" />
                      <Typography variant="body2">{job.position} Positions</Typography>
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
                      label={`${job.applications?.length || 0} Applications`}
                      size="small"
                      color="secondary"
                    />
                  </Stack>

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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click "Create New Job" to post your first job
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Job Form Dialog */}
      <JobFormDialog
        open={openJobDialog}
        onClose={() => {
          setOpenJobDialog(false);
          setEditingJob(null);
        }}
        job={editingJob}
        onSave={handleSaveJob}
      />
    </Box>
  );
};

export default CompanyJobs;