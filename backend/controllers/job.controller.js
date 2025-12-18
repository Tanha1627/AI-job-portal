import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";


export const postJob = async (req, res) => {
    try {
        // Get companyId from URL params instead of body
      const { companyId } = req.params;
        const { title, description, requirements, salary, location, jobType, experience, position } = req.body;
        const userId = req.id;

        // Validation
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        // if (!companyId) {
        //     return res.status(400).json({
        //         message: "Company ID is required.",
        //         success: false
        //     });
        // }

        // // Verify company exists and belongs to this user
        // const company = await Company.findOne({ _id: companyId, userId: userId });
        // if (!company) {
        //     return res.status(404).json({
        //         message: "Company not found or you don't have permission.",
        //         success: false
        //     });
        // }
        const company = await Company.findOne({ _id: companyId, userId });
if (!company) {
  return res.status(404).json({ message: "Company not found or no permission", success: false });
}


        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log('Error in postJob:', error);
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message
        });
    }
}



// // admin post krega job
// export const postJob = async (req, res) => {
//     try {
//         const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
//         const userId = req.id;

//         if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
//             return res.status(400).json({
//                 message: "Somethin is missing.",
//                 success: false
//             })
//         };
//         const job = await Job.create({
//             title,
//             description,
//             requirements: requirements.split(","),
//             salary: Number(salary),
//             location,
//             jobType,
//             experienceLevel: experience,
//             position,
//             company: companyId,
//             created_by: userId
//         });
//         return res.status(201).json({
//             message: "New job created successfully.",
//             job,
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }
// for student 
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications",
            select: "fullname email phoneNumber resumeFileUrl resumeOriginalName coverLetter status createdAt applicant",
            populate: {
      path: "applicant",
      model: "User",  
      select: "fullname email phoneNumber profile"
    }
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}


// jobs created by admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


// NEW: Get jobs by company ID (for admin)
export const getJobsByCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const adminId = req.id;

        const jobs = await Job.find({ 
            company: companyId,
            created_by: adminId 
        })
        .populate({
            path: 'company',
            select: 'name logo'
        })
        .populate({
            path: 'applications',
            populate: {
                path: 'applicant',
                select: 'fullname email phoneNumber profile'
            }
        })
        .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// const keyword = req.query.keyword || "";
// ```

// **What it does:**
// - Extracts `keyword` from URL query parameters
// - If no keyword provided, defaults to empty string

// **Example URLs:**
// ```
// GET /api/v1/job/get                    → keyword = ""
// GET /api/v1/job/get?keyword=developer  → keyword = "developer"
// GET /api/v1/job/get?keyword=react      → keyword = "react"