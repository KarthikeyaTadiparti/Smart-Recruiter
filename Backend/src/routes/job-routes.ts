import { Router } from "express";
import { ensureAuthentication } from "../middlewares/auth.ts";
import { addInterviewQuestions, generateInterviewQuestions, getAllJobs } from "../controllers/job-controller.ts";

const jobRouter = Router();

jobRouter.get("/", getAllJobs);
jobRouter.post("/generate", ensureAuthentication, generateInterviewQuestions);
jobRouter.patch("/:id", ensureAuthentication, addInterviewQuestions);

export default jobRouter;