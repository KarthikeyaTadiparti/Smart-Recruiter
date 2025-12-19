import { Request, Response } from "express";
import wrapAsync from "../utils/wrap-async.ts";
import { fetchInterviewQuestions } from "../services/jobs-services.ts";
import ExpressError from "../middlewares/errorhandler.ts";
import { GoogleGenAI } from "@google/genai";
import { generateFeedback } from "../utils/prompts.ts";

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

        // Optional: Persist application
        // const application = await applicationService.create({
        //     jobId,
        //     userId,
        //     tabSwitches,
        //     feedback: feedbackJson,
        // });

        return res.status(200).json({
            status: true,
            feedback: feedbackJson, 
            message: "Application created successfully",
        });
    }
);

