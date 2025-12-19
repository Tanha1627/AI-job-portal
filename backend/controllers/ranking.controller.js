import axios from 'axios';
import { Job } from "../models/job.model.js";

// Python ML service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

export const rankApplications = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        
        // Fetch job with applications
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            select: 'fullname email phoneNumber resumeFileUrl resumeOriginalName coverLetter status createdAt applicant',
            populate: {
                path: 'applicant',
                model: 'User',
                select: 'fullname email phoneNumber profile'
            }
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found',
                success: false
            });
        }

        if (!job.applications || job.applications.length === 0) {
            return res.status(200).json({
                message: 'No applications to rank',
                success: true,
                rankedApplications: []
            });
        }

        // Prepare data for ML service
        const applicationsForRanking = job.applications.map(app => ({
            id: app._id.toString(),
            fullname: app.fullname,
            email: app.email,
            phoneNumber: app.phoneNumber,
            resumeFileUrl: app.resumeFileUrl,
            coverLetter: app.coverLetter,
            status: app.status,
            createdAt: app.createdAt,
            applicantProfile: app.applicant?.profile
        }));

        const jobDescription = `${job.title} ${job.description} ${job.requirements.join(' ')}`;

        // Call Python ML service
        const mlResponse = await axios.post(`${ML_SERVICE_URL}/rank`, {
            applications: applicationsForRanking,
            job_description: jobDescription
        }, {
            timeout: 60000 // 60 second timeout
        });

        if (!mlResponse.data.success) {
            throw new Error('ML service returned error');
        }

        return res.status(200).json({
            message: 'Applications ranked successfully',
            success: true,
            rankedApplications: mlResponse.data.ranked_applications,
            job: {
                id: job._id,
                title: job.title,
                description: job.description
            }
        });

    } catch (error) {
        console.error('Error ranking applications:', error);
        return res.status(500).json({
            message: 'Failed to rank applications',
            error: error.message,
            success: false
        });
    }
};

export const getRankedApplications = async (req, res) => {
    try {
        // This is a wrapper that calls rankApplications
        // and returns the data in a format expected by the frontend
        await rankApplications(req, res);
    } catch (error) {
        console.error('Error getting ranked applications:', error);
        return res.status(500).json({
            message: 'Failed to get ranked applications',
            success: false
        });
    }
};