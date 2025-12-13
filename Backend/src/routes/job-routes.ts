import { Router } from "express";
import { ensureAuthentication } from "../middlewares/auth.ts";
import { getAllJobs } from "../controllers/job-controller.ts";

const jobRouter = Router();

jobRouter.get("/", getAllJobs);

export default jobRouter;