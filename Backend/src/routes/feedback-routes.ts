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

// Create application (with AI feedback generation)
feedbackRouter.post("/", ensureAuthentication, createApplication);

// Get all applications
feedbackRouter.get("/", ensureAuthentication, getAllApplicationsController);

// Get applications by candidate id (must come before /:id)
feedbackRouter.get(
    "/candidate/:candidateId",
    ensureAuthentication,
    getApplicationsByCandidate
);

// Get applications by job id (must come before /:id)
feedbackRouter.get(
    "/job/:jobId",
    ensureAuthentication,
    getApplicationsByJob
);

// Get application by id
feedbackRouter.get("/:id", ensureAuthentication, getApplication);



export default feedbackRouter;
