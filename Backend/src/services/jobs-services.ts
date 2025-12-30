import db from "../config/db.ts";
import { desc, eq, sql } from "drizzle-orm";
import { jobs } from "../schema/jobs-schema.ts";
import { companies } from "../schema/companies-schema.ts";
import ExpressError from "../middlewares/errorhandler.ts";
import { Question } from "../types/interview.ts";
import { users } from "../schema/users-schema.ts";
import { applications } from "../schema/applications-schema.ts";

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
        )
        .orderBy(desc(jobs.createdAt));

    return allJobs;
}

export async function fetchJobs(id: number) {
    const [job] = await db
        .select({
            //job
            jobId: jobs.jobId,
            jobRole: jobs.jobRole,
            description: jobs.description,
            techStack: jobs.techStack,
            experience: jobs.experience,
            location: jobs.location,
            closedAt: jobs.closedAt,
            interviewType: jobs.interviewType,
            interviewDuration: jobs.interviewDuration,
            noOfQuestions: jobs.noOfQuestions,

            //company
            comapnyName: companies.name,
            companyDescription: companies.description,
            website: companies.website,

            //recruiter
            recruiterName: users.name,
            email: users.email,
        })
        .from(jobs)
        .innerJoin(companies, eq(companies.companyId, jobs.companyId))
        .innerJoin(users, eq(users.id, jobs.recruiterId))
        .where(eq(jobs.jobId, id));

    return job;
}

export async function fetchJobsByRecruiter(id: number) {
    const jobsByRecruiter = await db
        .select({
            //job
            jobId: jobs.jobId,
            jobRole: jobs.jobRole,
            description: jobs.description,
            techStack: jobs.techStack,
            experience: jobs.experience,
            location: jobs.location,
            closedAt: jobs.closedAt,
            interviewType: jobs.interviewType,
            interviewDuration: jobs.interviewDuration,
            noOfQuestions: jobs.noOfQuestions,
        })
        .from(jobs)
        .where(eq(jobs.recruiterId, id))
        .orderBy(desc(jobs.createdAt));

    return jobsByRecruiter;
}



export async function fetchInterviewQuestions(id: number) {
    const [job] = await db
        .select({
            jobId: jobs.jobId,
            jobRole: jobs.jobRole,
            interviewType: jobs.interviewType,
            interviewDuration: jobs.interviewDuration,
            questions: jobs.questions,
            noOfQuestions: jobs.noOfQuestions,
        })
        .from(jobs)
        .where(eq(jobs.jobId, id));

    return job;
}

export async function fetchRecruiterMetrics(recruiterId: number) {
    const [metrics] = await db
        .select({
            jobsCreated: sql<number>`CAST(count(distinct ${jobs.jobId}) AS INTEGER)`,
            totalCandidatesInterviewed: sql<number>`CAST(count(${applications.applicationId}) AS INTEGER)`,
            avgOverallCandidatesScore: sql<number>`CAST(ROUND(COALESCE(avg(${applications.overallScore}), 0), 1) AS FLOAT)`,
            interviewMinutes: sql<number>`CAST(COALESCE(sum(CASE WHEN ${applications.applicationId} IS NOT NULL THEN ${jobs.interviewDuration} ELSE 0 END), 0) AS INTEGER)`
        })
        .from(jobs)
        .leftJoin(applications, eq(jobs.jobId, applications.jobId))
        .where(eq(jobs.recruiterId, recruiterId));

    return metrics;
}

