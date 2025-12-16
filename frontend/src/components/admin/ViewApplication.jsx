import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Visibility,
  Download
} from '@mui/icons-material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker using the public folder
if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';

const ViewApplication = () => {
 const { id } = useParams();
const jobId = id;
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null); // Track which app is being updated


   const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);


  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        setLoading(true);
        
        // Fetch job details with populated applications
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`,
          { withCredentials: true }
        );
        
        console.log('Fetched job data:', res.data);
        
        if (res.data.success) {
          setJob(res.data.job);
          setApplications(res.data.job.applications || []);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplications();
  }, [jobId]);

  // Update application status (Accept/Reject)
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingStatus(applicationId);
      
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update local state to reflect the change
        setApplications(applications.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
        alert(`Application ${newStatus} successfully!`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };


   // PDF viewer functions
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    // setPdfLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setPdfLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, textAlign: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="error">Job not found</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Jobs
      </Button>

      {/* Job Details Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {job.title}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Chip label={job.jobType} />
          <Chip label={`${job.salary} LPA`} />
          <Chip label={job.location} />
          <Chip label={job.experienceLevel} />
          <Chip label={`${job.position} Positions`} />
        </Stack>
        <Typography color="text.secondary">
          {job.description}
        </Typography>
      </Paper>

      {/* Applications Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Applications ({applications.length})
        </Typography>
        <Stack direction="row" spacing={2}>
          <Chip label={`Pending: ${applications.filter(a => a.status === 'pending').length}`} />
          <Chip label={`Accepted: ${applications.filter(a => a.status === 'accepted').length}`} color="success" />
          <Chip label={`Rejected: ${applications.filter(a => a.status === 'rejected').length}`} color="error" />
        </Stack>
      </Box>

      {/* Applications Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Applicant</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Applied Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <TableRow key={app._id} hover>
                  {/* Applicant */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={app.applicant?.profile?.profilePhoto}>
                        {app.applicant?.fullname?.charAt(0) || '?'}
                      </Avatar>
                      <Typography>{app.applicant?.fullname || 'N/A'}</Typography>
                    </Box>
                  </TableCell>

                  {/* Email */}
                  <TableCell>{app.applicant?.email || 'N/A'}</TableCell>

                  {/* Phone */}
                  <TableCell>{app.applicant?.phoneNumber || 'N/A'}</TableCell>

                  {/* Applied Date */}
                  <TableCell>{app.createdAt?.split('T')[0]}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={app.status}
                      color={getStatusColor(app.status)}
                      size="small"
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {/* View Details */}
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedApplication(app);
                          setOpenDetailDialog(true);
                        }}
                        title="View Details"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      
                      {/* Accept Button */}
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => updateApplicationStatus(app._id, 'accepted')}
                        disabled={app.status === 'accepted' || updatingStatus === app._id}
                        title="Accept"
                      >
                        {updatingStatus === app._id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CheckCircle fontSize="small" />
                        )}
                      </IconButton>
                      
                      {/* Reject Button */}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => updateApplicationStatus(app._id, 'rejected')}
                        disabled={app.status === 'rejected' || updatingStatus === app._id}
                        title="Reject"
                      >
                        {updatingStatus === app._id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Cancel fontSize="small" />
                        )}
                      </IconButton>

                      {/* Download Resume */}
                      {app.resumeFileUrl && (
                        <IconButton
                          size="small"
                          onClick={() => window.open(app.resumeFileUrl, '_blank')}
                          title="Download Resume"
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 4 }}>
                    No applications yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Application Detail Dialog */}
      {selectedApplication && (
        <Dialog
          open={openDetailDialog}
          onClose={() => setOpenDetailDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Application Details
            <Chip 
              label={selectedApplication.status} 
              color={getStatusColor(selectedApplication.status)}
              size="small"
              sx={{ ml: 2 }}
            />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Applicant Name</Typography>
                <Typography variant="body1">{selectedApplication.applicant?.fullname || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{selectedApplication.applicant?.email || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{selectedApplication.applicant?.phoneNumber || 'Not provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Bio</Typography>
                <Typography variant="body1">{selectedApplication.applicant?.profile?.bio || 'Not provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Skills</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                  {selectedApplication.applicant?.profile?.skills?.length > 0 ? (
                    selectedApplication.applicant.profile.skills.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" color="primary" variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No skills listed</Typography>
                  )}
                </Stack>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Cover Letter</Typography>
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {selectedApplication.coverLetter || 'Not provided'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">{selectedApplication.resumeOriginalName || 'not provided'}</Typography>
                {selectedApplication.resumeOriginalName ? (
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => window.open(selectedApplication.resumeFileUrl, '_blank')}
                    sx={{ mt: 1 }}
                  >
                    Download Resume

                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">No resume uploaded</Typography>
                )}
              </Box>
               {/* PDF Viewer Section */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Resume Preview
                </Typography>

                {selectedApplication.resumeFileUrl ? (
                  <Box
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      bgcolor: '#f5f5f5'
                    }}
                  >
                    {/* PDF Navigation Controls */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        p: 1,
                        bgcolor: '#fff',
                        borderBottom: '1px solid #ccc'
                      }}
                    >
                      <IconButton
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        size="small"
                      >
                        <NavigateBefore />
                      </IconButton>
                      <Typography variant="body2">
                        Page {pageNumber} of {numPages || '...'}
                      </Typography>
                      <IconButton
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        size="small"
                      >
                        <NavigateNext />
                      </IconButton>
                    </Box>

                    {/* PDF Document */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '500px',
                        maxHeight: '600px',
                        overflow: 'auto',
                        p: 2
                      }}
                    >
                      {pdfLoading && <CircularProgress />}
                      <Document
                        file={selectedApplication.resumeFileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<CircularProgress />}
                        error={
                          <Typography color="error">
                            Failed to load PDF. Please try downloading instead.
                          </Typography>
                        }
                      >
                        <Page
                          pageNumber={pageNumber}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          width={Math.min(window.innerWidth * 0.7, 800)}
                        />
                      </Document>
                    </Box>
                  </Box>
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2" color="text.secondary">
                      No resume uploaded
                    </Typography>
                  </Paper>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Applied Date</Typography>
                <Typography variant="body1">{selectedApplication.createdAt?.split('T')[0]}</Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
            <Button 
              variant="contained" 
              color="success"
              onClick={() => {
                updateApplicationStatus(selectedApplication._id, 'accepted');
                setOpenDetailDialog(false);
              }}
              disabled={selectedApplication.status === 'accepted'}
            >
              Accept
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={() => {
                updateApplicationStatus(selectedApplication._id, 'rejected');
                setOpenDetailDialog(false);
              }}
              disabled={selectedApplication.status === 'rejected'}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ViewApplication;




