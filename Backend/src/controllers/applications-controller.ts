import { GoogleGenAI } from "@google/genai";
import { generateFeedback } from "../utils/prompts.ts";
import { Application } from "../types/interview.ts";
import {
    addApplication,
    getApplicationById,
    getApplicationsByCandidateId,
    getApplicationsByJobId,
} from "../services/applications-services.ts";
import wrapAsync from "../utils/wrap-async.ts";
import { Request, Response } from "express";
import ExpressError from "../middlewares/errorhandler.ts";
import { safeAverage } from "../utils/utils.ts";
import redisClient from "../config/redis.ts";
import { invalidateKeys } from "../utils/cacheInvalidation.ts";

export const createApplication = wrapAsync(
    async (req: Request, res: Response) => {
        const userId = Number(req.user!.id);
        const jobId = Number(req.body.jobId);
        const tabSwitches = Number(req.body.tabSwitches);
        const conversation = req.body.conversation;
        const questions = req.body.questions;

        // console.log(questions);

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!,
        });

        const prompt = generateFeedback(conversation, questions);

        let response;
        try {
            response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
        } catch (err: any) {
            // Gemini overload handling
            if (err?.error?.code === 503) {
                throw new ExpressError(503, "AI service is currently busy. Please try again in a moment.");
            }

            console.error("Gemini error:", err);
            throw new ExpressError(500, "Failed to generate AI feedback");
        }

        const rawFeedback = response.text;

        if (!rawFeedback) {
            throw new ExpressError(500, "AI did not return any feedback text");
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
            throw new ExpressError(500, "Invalid AI feedback format");
        }

        // Validate feedback structure
        if (
            !feedbackJson ||
            !Array.isArray(feedbackJson.questionAnswers) ||
            typeof feedbackJson.scores !== "object" ||
            typeof feedbackJson.summary !== "string"
        ) {
            throw new ExpressError(500, "AI feedback structure is invalid");
        }

        const scores = feedbackJson.scores;

        const application: Application = {
            candidateId: userId,
            jobId: jobId,

            technicalScore: Number(scores?.technicalScore),
            communicationScore: Number(scores?.communicationScore),
            confidenceScore: Number(scores?.confidenceScore),
            overallScore: Number(scores?.overallScore),

            tabSwitches: Number(tabSwitches),
            conversation: conversation,
            questionAnswers: feedbackJson?.questionAnswers,
            feedback: feedbackJson?.summary,
        };

        const dbresponse = await addApplication(application);

        // Invalidate cache
        await invalidateKeys([
            `applications:candidate:${userId}`,
            `applications:job:${jobId}`,
        ]);

        return res.status(201).json({
            status: true,
            application: dbresponse,
            message: "Application created successfully",
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

        const response = await getApplicationById(applicationId);

        if (!response) {
            throw new ExpressError(404, "Application not found");
        }

        return res.status(200).json({
            status: true,
            message: "Application retrieved successfully",
            application: response?.application,
            candidate: response?.candidate,
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
        const interviewsAttended = applications.length;

        let technicalScore = 0;
        let communicationScore = 0;
        let confidenceScore = 0;

        for (const application of applications) {
            technicalScore += application.technicalScore;
            communicationScore += application.communicationScore;
            confidenceScore += application.confidenceScore;
        }

        const avgTechnicalScore = safeAverage(technicalScore, interviewsAttended);
        const avgCommunicationScore = safeAverage(communicationScore, interviewsAttended);
        const avgConfidenceScore = safeAverage(confidenceScore, interviewsAttended);

        return res.status(200).json({
            status: true,
            message: "Candidate applications retrieved successfully",
            applications,
            metrics: {
                interviewsAttended,
                avgTechnicalScore,
                avgCommunicationScore,
                avgConfidenceScore,
            },
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


