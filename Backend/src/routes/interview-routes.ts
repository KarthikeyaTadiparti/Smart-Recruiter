import express from "express";
import {
    createApplication,
    getInterview,
} from "../controllers/interview-controller.ts";
import { ensureAuthentication } from "../middlewares/auth.ts";

const interviewRouter = express.Router();

interviewRouter.get("/:id", getInterview);
interviewRouter.post("/", ensureAuthentication, createApplication);

export default interviewRouter;
