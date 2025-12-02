import db from "../config/db.ts";
import { eq } from "drizzle-orm";
import { interviews } from "../schema/interviews-schema.ts";

export async function addInterview(interview_duration: string,interview_type: string,no_of_questions: string,jobId: number){
    const [interview] = await db.insert(interviews).values({
        interviewDuration : parseInt(interview_duration),
        interviewType : interview_type,
        noOfQuestions : parseInt(no_of_questions),
        jobId : jobId
    }).returning();
    return interview;
}