import express from "express";
import {
    createApplication,
    getApplication,
    getAllApplicationsController,
    getApplicationsByCandidate,
    getApplicationsByJob,
} from "../controllers/feedback-controller.ts";
import { ensureAuthentication } from "../middlewares/auth.ts";

const feedbackRouter = express.Router();

feedbackRouter.post("/", ensureAuthentication, createApplication);
feedbackRouter.get("/:id", ensureAuthentication, getApplication);

// candidate can view their applications for various jobs
feedbackRouter.get(
    "/candidate/:candidateId",
    ensureAuthentication,
    getApplicationsByCandidate
);

// recruiter can view applications for a specific job
feedbackRouter.get(
    "/job/:jobId",
    ensureAuthentication,
    getApplicationsByJob
);


// Get all applications
feedbackRouter.get("/", ensureAuthentication, getAllApplicationsController);



export default feedbackRouter;
