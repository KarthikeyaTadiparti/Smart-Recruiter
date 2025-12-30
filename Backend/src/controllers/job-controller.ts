import { fetchAllJobs, fetchJobs, fetchJobsByRecruiter, fetchRecruiterMetrics } from "../services/jobs-services.ts";
import wrapAsync from "../utils/wrap-async.ts";
import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import ExpressError from "../middlewares/errorhandler.ts";
import { addJob } from "../services/jobs-services.ts";
import { addQuestions } from "../services/jobs-services.ts";
import { generateQuestion } from "../utils/prompts.ts";

export const generateInterviewQuestions = wrapAsync(
    async (req: Request, res: Response) => {
        const {
            job_role,
            description,
            tech_stack,
            experience,
            location,
            closed_at,
            interview_duration,
            interview_type,
            no_of_questions,
            companyId,
        } = req.body;

        const userId = Number(req.user!.id);
        const companyIdNum = Number(companyId);

        // Validation
        if (
            !job_role ||
            !description ||
            !tech_stack ||
            experience === undefined ||
            !location ||
            !closed_at ||
            interview_duration === undefined ||
            !interview_type ||
            no_of_questions === undefined
        ) {
            throw new ExpressError(400, "All fields are required");
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!,
        });

        const prompt = generateQuestion(
            job_role,
            description,
            tech_stack,
            experience,
            interview_type,
            no_of_questions
        );

        let response;
        try {
            response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
        } catch (err: any) {
            // Gemini overload handling
            if (err?.error?.code === 503) {
                return res.status(503).json({
                    status: false,
                    message:
                        "AI service is currently busy. Please try again in a moment.",
                });
            }

            console.error("Gemini error:", err);
            return res.status(500).json({
                status: false,
                message: "Failed to generate interview questions",
            });
        }

        const rawQuestion = response.text;

        if (!rawQuestion) {
            return res.status(500).json({
                status: false,
                message: "AI did not return any questions",
            });
        }

        // Clean markdown-wrapped JSON
        const cleanedQuestion = rawQuestion
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let questionsJSON;
        try {
            questionsJSON = JSON.parse(cleanedQuestion);
        } catch (error) {
            console.error("Failed to parse questions:", cleanedQuestion);
            return res.status(500).json({
                status: false,
                message: "Invalid AI question format",
            });
        }

        // Ensure expected structure
        if (
            !questionsJSON ||
            !Array.isArray(questionsJSON.questions)
        ) {
            return res.status(500).json({
                status: false,
                message: "AI returned an unexpected questions format",
            });
        }

        // Job Creation
        const job = await addJob(
            job_role,
            description,
            tech_stack,
            experience,
            location,
            closed_at,
            userId,
            companyIdNum,
            interview_duration,
            interview_type,
            no_of_questions
        );

        return res.status(200).json({
            status: true,
            message: "Questions generated successfully",
            job,
            questions: questionsJSON.questions,
        });
    }
);

export const addInterviewQuestions = wrapAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const jobId = Number(id);
        const questions = req.body;

        // console.log("Questions : ", questions);
        // console.log("interview Id", id);

        const updatedInterview = await addQuestions(jobId, questions);
        return res.status(200).json({
            status: true,
            message: "Job created successfully!",
            updatedInterview,
        });
    }
);

export const getAllJobs = wrapAsync(async (req: Request, res: Response) => {
    const jobs = await fetchAllJobs();

    return res.status(200).json({ status: true, jobs });
});

export const getAllJobsByRecruiter = wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const recruiterId = Number(id);

    const jobs = await fetchJobsByRecruiter(recruiterId);
    const metrics = await fetchRecruiterMetrics(recruiterId);

    return res.status(200).json({
        status: true,
        jobs,
        metrics
    });
});

export const getJob = wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const jobId = Number(id);

    const job = await fetchJobs(jobId);
    return res.status(200).json({ status: true, job });
});
