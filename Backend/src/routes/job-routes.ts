import { Router } from "express";
import { ensureAuthentication } from "../middlewares/auth.ts";
import { addInterviewQuestions, generateInterviewQuestions, getAllJobs, getJob } from "../controllers/job-controller.ts";

const jobRouter = Router();

jobRouter.get("/", ensureAuthentication, getAllJobs);
jobRouter.get("/:id", ensureAuthentication, getJob);
jobRouter.post("/generate", ensureAuthentication, generateInterviewQuestions);
jobRouter.patch("/:id", ensureAuthentication, addInterviewQuestions);

export default jobRouter;