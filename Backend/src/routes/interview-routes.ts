import express from "express";
import { getInterview } from "../controllers/interview-controller.ts";

const interviewRouter = express.Router();

interviewRouter.get("/:id", getInterview);

export default interviewRouter;
