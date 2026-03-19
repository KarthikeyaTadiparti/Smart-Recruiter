import db from "../config/db.ts";
import { desc, eq } from "drizzle-orm";
import { applications } from "../schema/applications-schema.ts";
import { users } from "../schema/users-schema.ts";
import { Application } from "../types/interview.ts";
import ExpressError from "../middlewares/errorhandler.ts";
import { jobs } from "../schema/jobs-schema.ts";

export async function addApplication(application: Application) {
    const [response] = await db
        .insert(applications)
        .values(application)
        .returning();

    return response;
}

export async function getApplicationById(applicationId: number) {
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
        throw new ExpressError(400, "Invalid application id");
    }

    const [result] = await db
        .select({
            application: applications,
            candidate: {
                name: users.name,
                email: users.email
            }
        })
        .from(applications)
        .innerJoin(users, eq(applications.candidateId, users.id))
        .where(eq(applications.applicationId, applicationId));

    if (!result) return null;

    return result;
}


export async function getApplicationsByCandidateId(candidateId: number) {
    if (!Number.isInteger(candidateId) || candidateId <= 0) {
        throw new ExpressError(400, "Invalid candidate id");
    }

    const candidateApplications = await db
        .select({
            applicationId : applications.applicationId,
            jobRole : jobs.jobRole,
            technicalScore : applications.technicalScore,
            communicationScore : applications.communicationScore,
            confidenceScore : applications.confidenceScore,
            overallScore : applications.overallScore,
            status : applications.status,
            feedback : applications.feedback,
            createdAt : applications.createdAt,
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.jobId))
        .where(eq(applications.candidateId, candidateId))
        .orderBy(desc(applications.createdAt));

    return candidateApplications;
}

export async function getApplicationsByJobId(jobId: number) {
    if (!Number.isInteger(jobId) || jobId <= 0) {
        throw new ExpressError(400, "Invalid job id");
    }

    const jobApplications = await db
        .select({
            application: {
                applicationId: applications.applicationId,
                overallScore: applications.overallScore,
                tabSwitches: applications.tabSwitches,
                status: applications.status,
                jobRole: jobs.jobRole,
            },
            candidate: {
                name: users.name,
                email: users.email
            }
        })
        .from(applications)
        .innerJoin(users, eq(applications.candidateId, users.id))
        .innerJoin(jobs, eq(applications.jobId, jobs.jobId))
        .where(eq(applications.jobId, jobId))
        .orderBy(desc(applications.overallScore));

    return jobApplications;
}

export async function updateApplicationStatus(applicationId: number, status: string) {
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
        throw new ExpressError(400, "Invalid application id");
    }

    const [updated] = await db
        .update(applications)
        .set({ status })
        .where(eq(applications.applicationId, applicationId))
        .returning();

    return updated;
}
