import db from "../config/db.ts";
import { eq } from "drizzle-orm";
import { jobs } from "../schema/jobs-schema.ts";
import { interviews } from "../schema/interviews-schema.ts";
import { companies } from "../schema/companies-schema.ts";

export async function addJob(job_role: string, description: string, tech_stack: string, experience: number, location: string, closed_at: string, userId: number, userCompanyId: number, interview_duration: string, interview_type: string, no_of_questions: string, jobId: number) {
    const [company] = await db.insert(jobs).values({
        jobRole: job_role,
        description: description,
        techStack: tech_stack,
        experience: experience,
        location: location,
        closedAt: closed_at,
        recruiterId: userId,
        companyId: userCompanyId,
    }).returning();
    return company;
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

            // ---- Company ----
            companyId: companies.companyId,
            companyName: companies.name,

            // ---- Interview ----
            interviewId: interviews.interviewId,
            interviewType: interviews.interviewType,
            interviewDuration: interviews.interviewDuration,
            noOfQuestions: interviews.noOfQuestions,
        })
        .from(jobs)
        .innerJoin(
            interviews,
            eq(jobs.jobId, interviews.jobId)
        )
        .innerJoin(
            companies,
            eq(jobs.companyId, companies.companyId)
        );

    return allJobs;
}

