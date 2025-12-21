import { Request, Response } from "express";
import wrapAsync from "../utils/wrap-async.ts";
import { fetchInterviewQuestions } from "../services/jobs-services.ts";
import ExpressError from "../middlewares/errorhandler.ts";


export const getInterview = wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const interviewId = Number(id);

    if (!Number.isInteger(interviewId) || interviewId <= 0) {
        throw new ExpressError(400, "Invalid interview id");
    }

    const interview = await fetchInterviewQuestions(interviewId);

    if (!interview) {
        throw new ExpressError(404, "Interview not found");
    }

    return res.status(200).json({
        status: true,
        message: "Your interview has started",
        interview,
    });
});

