import {Router } from "express";
import { ensureAuthentication } from "../middlewares/auth.ts";
// import { createJob } from "../controllers/jobs-controller.ts";

const jobRouter = Router();

// jobRouter.post("/", ensureAuthentication,createJob);

export default jobRouter;