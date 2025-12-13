import db from "../config/db.ts";
import { eq, sql } from "drizzle-orm";
import { jobs } from "../schema/jobs-schema.ts";
import { companies } from "../schema/companies-schema.ts";
import ExpressError from "../middlewares/errorhandler.ts";
import { Question } from "../types/interview.ts";

export async function addJob(
    job_role: string,
    description: string,
    tech_stack: string,
    experience: number,
    location: string,
    closed_at: string,
    userId: number,
    userCompanyId: number,
    interview_duration: string,
    interview_type: string,
    no_of_questions: string
) {
    const [company] = await db.insert(jobs).values({
        jobRole: job_role,
        description: description,
        techStack: tech_stack,
        experience: experience,
        location: location,
        closedAt: closed_at,
        recruiterId: userId,
        companyId: userCompanyId,
        interviewDuration: parseInt(interview_duration),
        interviewType: interview_type,
        noOfQuestions: parseInt(no_of_questions),
    }).returning();
    return company;
}

export async function addQuestions(jobId: number, questions: Question[]) {
    if (!Number.isInteger(jobId) || jobId <= 0)
        throw new ExpressError(400, "jobId must be a positive integer");

    if (!Array.isArray(questions))
        throw new ExpressError(400, "questions must be an array");

    const [updated] = await db
        .update(jobs)
        .set({
            questions: questions as any,
            updatedAt: sql`now()`
        })
        .where(eq(jobs.jobId, jobId))
        .returning();

    return updated;
}

export async function fetchAllJobs() {
    const allJobs = await db
        .select({
            // ---- Job ----
            jobId: jobs.jobId,
            jobRole: jobs.jobRole,
            description: jobs.description,
            techStack: jobs.techStack,
            experience: jobs.experience,
            location: jobs.location,
            closedAt: jobs.closedAt,

            // ---- Interview ----
            interviewType: jobs.interviewType,
            interviewDuration: jobs.interviewDuration,
            noOfQuestions: jobs.noOfQuestions,

            // ---- Company ----
            companyId: companies.companyId,
            companyName: companies.name,

        })
        .from(jobs)
        .innerJoin(
            companies,
            eq(jobs.companyId, companies.companyId)
        );

    return allJobs;
}