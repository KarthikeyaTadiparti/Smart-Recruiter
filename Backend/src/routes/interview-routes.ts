import express from "express";
import { getInterview } from "../controllers/interview-controller.ts";
import { ensureAuthentication } from "../middlewares/auth.ts";

const interviewRouter = express.Router();

interviewRouter.get("/:id",getInterview);

export default interviewRouter;