import express from "express";
import {
    createApplication,
    getApplication,
    getApplicationsByCandidate,
    getApplicationsByJob,
} from "../controllers/applications-controller.ts";
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


export default feedbackRouter;
