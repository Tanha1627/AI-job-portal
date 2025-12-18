import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, getJobsByCompany, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post/:companyId").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated,getAllJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/company/:companyId").get(isAuthenticated, getJobsByCompany); 


export default router;
