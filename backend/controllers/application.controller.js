import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        
        // Extract form data from request body
        const { fullname, email, phoneNumber, coverLetter } = req.body;
        
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        // Validate required fields
        if (!fullname || !email || !phoneNumber || !coverLetter) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Check if resume file was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Resume is required.",
                success: false
            });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ 
            job: jobId, 
            applicant: userId 
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Upload resume to Cloudinary
        const fileUri = getDataUri(req.file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
            resource_type: "auto",
            folder: "application_resumes",
            format: "pdf"
        });

        // Create viewable URL (removes forced download)
        const viewableUrl = cloudResponse.secure_url.replace(
            '/upload/', 
            '/upload/fl_attachment:false/'
        );

        // Create a new application with all fields
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            fullname,
            email,
            phoneNumber,
            coverLetter,
            resumeFileUrl: viewableUrl,
            resumeOriginalName: req.file.originalname
        });

        // Add application to job's applications array
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job application submitted successfully.",
            success: true,
            application: newApplication
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id; //Application.find({ applicant: userId }Thisline queries the Application collection to find all the applications that belong to this user.
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}


//example result:
// [
//   {
//     _id: "applicationId1",
//     job: {
//       _id: "jobId1",
//       title: "Frontend Developer",
//       company: {
//         _id: "companyId1",
//         name: "Google",
//         location: "California"
//       },
//       salary: 80000
//     },
//     applicant: "userId",
//     status: "pending"
//   },
//   {
//     _id: "applicationId2",
//     job: {
//       _id: "jobId2",
//       title: "Backend Engineer",
//       company: {
//         _id: "companyId2",
//         name: "Amazon",
//         location: "Seattle"
//       },
//       salary: 90000
//     },
//     applicant: "userId",
//     status: "accepted"
//   }
// ]
