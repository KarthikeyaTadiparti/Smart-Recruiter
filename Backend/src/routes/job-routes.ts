import { Router } from "express";
import { ensureAuthentication } from "../middlewares/auth.ts";
import { addInterviewQuestions, generateInterviewQuestions, getAllJobs, getAllJobsByRecruiter, getJob } from "../controllers/job-controller.ts";
import { cache } from "../middlewares/cache.ts";

const jobRouter = Router();

jobRouter.get("/", ensureAuthentication, cache((req) => `jobs`),getAllJobs);
jobRouter.get("/:id", ensureAuthentication, cache((req) => `jobs:id:${req.params.id}`), getJob);
jobRouter.get("/recruiter/:id", ensureAuthentication, cache((req) => `jobs:recruiter:${req.params.id}`), getAllJobsByRecruiter);
jobRouter.post("/generate", ensureAuthentication, generateInterviewQuestions);
jobRouter.patch("/:id", ensureAuthentication, addInterviewQuestions);

export default jobRouter;