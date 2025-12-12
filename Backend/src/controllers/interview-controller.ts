import wrapAsync from "../utils/wrap-async.ts";
import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import ExpressError from "../middlewares/errorhandler.ts";
import { addJob } from "../services/jobs-services.ts";
import { addInterview, addQuestions } from "../services/interviews-services.ts";


export const generateInterviewQuestions = wrapAsync(async (req: Request, res: Response) => {
    const { job_role,
        description,
        tech_stack,
        experience,
        location,
        closed_at,
        interview_duration,
        interview_type,
        no_of_questions
    } = req.body;
    const userId = Number(req.user!.id);
    const userCompanyId = Number(req.user!.companyId ?? req.body.company_id);

    if (!job_role || !description || !tech_stack || experience === undefined || !location || !closed_at || interview_duration === undefined || !interview_type || no_of_questions === undefined)
        throw new ExpressError(400, "All fields are required");

    // Questions Generation
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!,
    });
    const prompt = `
        You are an expert interviewer. Generate interview questions based on the job information below.

        Job Role: ${job_role}
        Description: ${description}
        Required Tech Stack: ${tech_stack}
        Experience Required (Years): ${experience}
        Interview Type: ${interview_type}
        Number of Questions Needed: ${no_of_questions}

        ### Interview Type Rules:
        - If Interview Type = "technical":
            * 80% technical based on tech_stack.
            * 20% scenario-based.
        - If Interview Type = "behavioral":
            * 80% behavior, teamwork, past experience.
            * 20% scenario-based.
        - If Interview Type = "hr":
            * Focus on culture fit, personality, strengths, weaknesses.
            * No technical questions.
        - If Interview Type = "mixed":
            * 40% technical, 30% behavioral, 30% scenario-based.

        ### Requirements:
        1. Difficulty must match experience.
        2. Every question must be highly relevant to the role.
        3. Output exactly ${no_of_questions} questions.
        4. Output strictly in JSON:

        {
        "questions": [
            { "type": "", "question": "" }
        ]
        }

        5. Do NOT include any non-JSON text.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    // Job Creation
    const job = await addJob(job_role, description, tech_stack, experience, location, closed_at, userId, userCompanyId);

    // Interview Creation
    const interview = await addInterview(interview_duration, interview_type, no_of_questions, job!.jobId);

    res.status(200).json({
        status: true,
        message: "Questions generated successfully",
        job,
        interview,
        questions: response.text,
    });
});


export const addInterviewQuestions = wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const interviewId = Number(id);
    const questions = req.body;

    console.log("Questions : ", questions);
    console.log("interview Id", id);

    const updatedInterview = await addQuestions(interviewId, questions);
    return res.status(200).json({ status: true, data: updatedInterview });
});