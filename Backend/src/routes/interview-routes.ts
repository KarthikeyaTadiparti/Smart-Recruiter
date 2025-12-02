import { Router } from "express";
import { ensureAuthentication } from "../middlewares/auth.ts";
import { generateQuestions } from "../controllers/interview-controller.ts";

const interviewRouter = Router();

// interviewRouter.post("/", ensureAuthentication,createInterview);
interviewRouter.post("/generate", ensureAuthentication, generateQuestions);

export default interviewRouter;