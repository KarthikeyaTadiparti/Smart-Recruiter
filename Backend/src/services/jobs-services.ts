import db from "../config/db.ts";
import { eq } from "drizzle-orm";
import { jobs } from "../schema/jobs-schema.ts";

export async function addJob(job_role: string,description: string,tech_stack: string,experience: number,location: string,closed_at: string, userId: number, userCompanyId: number){
    const [company] = await db.insert(jobs).values({
        jobRole : job_role,
        description : description,
        techStack : tech_stack,
        experience : experience,
        location : location,
        closedAt : closed_at,
        recruiterId : userId,
        companyId : userCompanyId
    }).returning();
    return company;
}