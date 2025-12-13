import { fetchAllJobs } from "../services/jobs-services.ts";
import wrapAsync from "../utils/wrap-async.ts";
import { Request, Response } from "express";

export const getAllJobs = wrapAsync(async (req: Request, res: Response) => {
    const jobs = await fetchAllJobs();

    return res.status(200).json({ jobs });
})