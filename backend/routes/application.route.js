import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
import { singleUpload } from "../middlewares/multer.js";
 
const router = express.Router();

// Apply for a job - now with file upload middleware
router.route("/apply/:id").post(isAuthenticated, singleUpload, applyJob);

// Get all applied jobs for a user
router.route("/get").get(isAuthenticated, getAppliedJobs);

// Get all applicants for a job (admin)
router.route("/:id/applicants").get(isAuthenticated, getApplicants);

// Update application status (admin)
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;












// import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
 
// const router = express.Router();

// router.route("/apply/:id").get(isAuthenticated, applyJob);
// router.route("/get").get(isAuthenticated, getAppliedJobs);
// router.route("/:id/applicants").get(isAuthenticated, getApplicants);
// router.route("/status/:id/update").post(isAuthenticated, updateStatus);
 

// export default router;
