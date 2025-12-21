import { GoogleGenAI } from "@google/genai";
import { generateFeedback } from "../utils/prompts.ts";
import { Application } from "../types/interview.ts";
import {
    addApplication,
    getApplicationById,
    getAllApplications,
    getApplicationsByCandidateId,
    getApplicationsByJobId,
} from "../services/applications-services.ts";
import wrapAsync from "../utils/wrap-async.ts";
import { Request, Response } from "express";
import ExpressError from "../middlewares/errorhandler.ts";

export const createApplication = wrapAsync(
    async (req: Request, res: Response) => {
        const userId = Number(req.user!.id);
        const jobId = Number(req.body.jobId);
        const tabSwitches = Number(req.body.tabSwitches);
        const conversation = req.body.conversation;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!,
        });

        const prompt = generateFeedback(conversation);

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
                message: "Failed to generate AI feedback",
            });
        }

        const rawFeedback = response.text;

        if (!rawFeedback) {
            return res.status(500).json({
                status: false,
                message: "AI did not return any feedback text",
            });
        }

        // Clean markdown-wrapped JSON
        const cleanedFeedback = rawFeedback
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let feedbackJson;
        try {
            feedbackJson = JSON.parse(cleanedFeedback);
        } catch (error) {
            console.error("LLM JSON parse error:", cleanedFeedback);
            return res.status(500).json({
                status: false,
                message: "Invalid AI feedback format",
            });
        }

        // Validate feedback structure
        if (
            !feedbackJson ||
            !Array.isArray(feedbackJson.questionAnswers) ||
            typeof feedbackJson.scores !== "object" ||
            typeof feedbackJson.summary !== "string"
        ) {
            return res.status(500).json({
                status: false,
                message: "AI feedback structure is invalid",
            });
        }

        const scores = feedbackJson.scores;
        const overallScore = (
            (Number(scores?.technicalScore) +
                Number(scores?.communicationScore) +
                Number(scores?.confidenceScore)) /
            3
        ).toFixed(1);
        const application: Application = {
            candidateId: userId,
            jobId: jobId,

            technicalScore: scores?.technicalScore,
            communicationScore: scores?.communicationScore,
            confidenceScore: scores?.confidenceScore,
            overallScore: overallScore,

            tabSwitches: tabSwitches,
            conversation: conversation,
            questionAnswers: feedbackJson?.questionAnswers,
            feedback: feedbackJson?.summary,
        };

        const dbresponse = await addApplication(application);

        return res.status(201).json({
            status: true,
            // feedback: feedbackJson,
            application: dbresponse,
            message: "Application created successfully",
        });
    }
);

export const getApplicationsByCandidate = wrapAsync(
    async (req: Request, res: Response) => {
        const { candidateId } = req.params;
        const id = Number(candidateId);

        if (!Number.isInteger(id) || id <= 0) {
            throw new ExpressError(400, "Invalid candidate id");
        }

        const applications = await getApplicationsByCandidateId(id);

        return res.status(200).json({
            status: true,
            message: "Candidate applications retrieved successfully",
            applications,
        });
    }
);

export const getApplication = wrapAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const applicationId = Number(id);

        if (!Number.isInteger(applicationId) || applicationId <= 0) {
            throw new ExpressError(400, "Invalid application id");
        }

        const application = await getApplicationById(applicationId);

        if (!application) {
            throw new ExpressError(404, "Application not found");
        }

        return res.status(200).json({
            status: true,
            message: "Application retrieved successfully",
            application,
        });
    }
);

export const getAllApplicationsController = wrapAsync(
    async (req: Request, res: Response) => {
        const applications = await getAllApplications();

        return res.status(200).json({
            status: true,
            message: "Applications retrieved successfully",
            applications,
            count: applications.length,
        });
    }
);


export const getApplicationsByJob = wrapAsync(
    async (req: Request, res: Response) => {
        const { jobId } = req.params;
        const id = Number(jobId);

        if (!Number.isInteger(id) || id <= 0) {
            throw new ExpressError(400, "Invalid job id");
        }

        const applications = await getApplicationsByJobId(id);

        return res.status(200).json({
            status: true,
            message: "Job applications retrieved successfully",
            applications,
            count: applications.length,
        });
    }
);

