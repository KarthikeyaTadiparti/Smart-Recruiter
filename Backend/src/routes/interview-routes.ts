import { Router } from "express";
import { ensureAuthentication } from "../middlewares/auth.ts";
import { addInterviewQuestions, generateQuestions } from "../controllers/interview-controller.ts";

const interviewRouter = Router();

// interviewRouter.post("/", ensureAuthentication,createInterview);
interviewRouter.post("/generate", ensureAuthentication, generateQuestions);
interviewRouter.patch("/:id", ensureAuthentication, addInterviewQuestions);

export default interviewRouter;