import db from "../config/db.ts";
import { eq, sql } from "drizzle-orm";
import { interviews } from "../schema/interviews-schema.ts";
import { Question } from "../types/interview.ts";
import ExpressError from "../middlewares/errorhandler.ts";

export async function addInterview(interview_duration: string, interview_type: string, no_of_questions: string, jobId: number) {
    const [interview] = await db.insert(interviews).values({
        interviewDuration: parseInt(interview_duration),
        interviewType: interview_type,
        noOfQuestions: parseInt(no_of_questions),
        jobId: jobId
    }).returning();
    return interview;
}


export async function addQuestions(interviewId: number, questions: Question[]) {
    if (!Number.isInteger(interviewId) || interviewId <= 0)
        throw new ExpressError(400, "interviewId must be a positive integer");

    if (!Array.isArray(questions))
        throw new ExpressError(400, "questions must be an array");

    const [updated] = await db
        .update(interviews)
        .set({
            questions: questions as any,
            updatedAt: sql`now()`
        })
        .where(eq(interviews.interviewId, interviewId))
        .returning();

    if (!Array.isArray(updated) || updated.length === 0) {
        throw new ExpressError(404, `Interview with id ${interviewId} not found`);
    }

    return updated;
}
