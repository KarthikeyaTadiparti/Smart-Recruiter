import db from "../config/db.ts";
import { eq } from "drizzle-orm";
import { applications } from "../schema/applications-schema.ts";
import { users } from "../schema/users-schema.ts";
import { Application } from "../types/interview.ts";
import ExpressError from "../middlewares/errorhandler.ts";

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

// --- remove it ---
export async function getAllApplications() {
    const allApplications = await db.select().from(applications);

    return allApplications;
}

export async function getApplicationsByCandidateId(candidateId: number) {
    if (!Number.isInteger(candidateId) || candidateId <= 0) {
        throw new ExpressError(400, "Invalid candidate id");
    }

    const [candidateApplications] = await db
        .select()
        .from(applications)
        .where(eq(applications.candidateId, candidateId));

    return candidateApplications;
}

export async function getApplicationsByJobId(jobId: number) {
    if (!Number.isInteger(jobId) || jobId <= 0) {
        throw new ExpressError(400, "Invalid job id");
    }

    const jobApplications = await db
        .select()
        .from(applications)
        .where(eq(applications.jobId, jobId));

    return jobApplications;
}
