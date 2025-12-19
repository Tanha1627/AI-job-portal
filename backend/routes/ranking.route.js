import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { rankApplications, getRankedApplications } from "../controllers/ranking.controller.js";

const router = express.Router();

// Get ranked applications for a job
router.route("/job/:jobId/ranked").get(isAuthenticated, getRankedApplications);

// Rank applications (can be same endpoint but explicit naming)
router.route("/rank/:jobId").post(isAuthenticated, rankApplications);

export default router;