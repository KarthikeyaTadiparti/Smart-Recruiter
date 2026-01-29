import express from "express";
import {
    createApplication,
    getApplication,
    getApplicationsByCandidate,
    getApplicationsByJob,
} from "../controllers/applications-controller.ts";
import { ensureAuthentication } from "../middlewares/auth.ts";
import { cache } from "../middlewares/cache.ts";

const applicationRouter = express.Router();

applicationRouter.post("/", ensureAuthentication, createApplication);
applicationRouter.get("/:id", ensureAuthentication, cache((req) => `applications:id:${req.params.id}`), getApplication);

// candidate can view their applications for various jobs
applicationRouter.get(
    "/candidate/:candidateId",
    ensureAuthentication,
    cache((req) => `applications:candidate:${req.params.candidateId}`),
    getApplicationsByCandidate
);

// recruiter can view applications for a specific job
applicationRouter.get(
    "/job/:jobId",
    ensureAuthentication,
    cache((req) => `applications:job:${req.params.jobId}`),
    getApplicationsByJob
);


export default applicationRouter;
