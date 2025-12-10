import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const JobFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const companyId = location.state?.companyId; // for creating a new job
  const jobId = params.id; // for editing an existing job

  const [formData, setFormData] = useState({
    title: '',
    position: '',
    jobType: 'Full-time',
    salary: '',
    location: '',
    description: '',
    experienceLevel: '',
    requirements: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!!jobId);

  // Fetch job if editing
  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (jobId) {
          const res = await axios.get(`${JOB_API_END_POINT}/${jobId}`, { withCredentials: true });
          if (res.data.success) {
            setFormData(res.data.job);
          }
        }
      } catch (err) {
        toast.error('Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.position || formData.position <= 0) newErrors.position = 'Valid position count required';
    if (!formData.salary || formData.salary <= 0) newErrors.salary = 'Valid salary required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {

         const payload = {
      ...formData,
      companyId,
      experience: formData.experienceLevel,
      salary: Number(formData.salary),
      position: Number(formData.position)
    };


      if (jobId) {
        // Update existing job
        const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`,  payload,  { withCredentials: true });
        if (res.data.success) {
          toast.success('Job updated successfully');
          navigate(`/admin/companies/${formData.companyId}/jobs`);
        }
      } else {
        // Create new job
        const res = await axios.post(`${JOB_API_END_POINT}/post`, payload,  { withCredentials: true });
        if (res.data.success) {
          toast.success('Job created successfully');
          navigate(`/admin/companies/${companyId}/jobs`);
        }
      }
    } catch (err) {
      toast.error('Failed to save job');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ maxWidth: 800, mx: 'auto', p: 3, mt: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        {jobId ? 'Edit Job' : 'Create New Job'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Job Title *"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Number of Positions *"
              type="number"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              error={!!errors.position}
              helperText={errors.position}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Job Type *"
              select
              value={formData.jobType}
              onChange={(e) => handleChange('jobType', e.target.value)}
              fullWidth
            >
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Salary (LPA) *"
              type="number"
              value={formData.salary}
              onChange={(e) => handleChange('salary', e.target.value)}
              error={!!errors.salary}
              helperText={errors.salary}
              inputProps={{ min: 0, step: 0.5 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Location *"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
              fullWidth
            />
          </Grid>
        </Grid>

        <TextField
          label="Experience Level"
          value={formData.experienceLevel}
          onChange={(e) => handleChange('experienceLevel', e.target.value)}
          fullWidth
        />

        <TextField
          label="Job Description *"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          fullWidth
        />

        <TextField
          label="Requirements"
          multiline
          rows={3}
          value={formData.requirements}
          onChange={(e) => handleChange('requirements', e.target.value)}
          fullWidth
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {jobId ? 'Update Job' : 'Create Job'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default JobFormPage;

// { ...formData, companyId },