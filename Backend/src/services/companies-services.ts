import db from "../config/db.ts";
import { eq, and } from "drizzle-orm";
import { companies } from "../schema/companies-schema.ts";
import { users } from "../schema/users-schema.ts";

export async function getCompany(userId: number) {
    const [company] = await db.select().from(companies).where(eq(companies.createdBy, userId));
    return company;
}

export async function addCompany(name: string, description: string, website: string, userId: number){
    const [company] = await db.insert(companies).values({name, description, website, createdBy: userId}).returning();
    return company;
}