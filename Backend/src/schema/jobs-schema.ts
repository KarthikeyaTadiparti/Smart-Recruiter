import { pgTable, serial, varchar, timestamp, integer, text } from "drizzle-orm/pg-core";
import { companies } from "./companies-schema.ts";
import { users } from "./users-schema.ts";

export const jobs = pgTable("jobs", {
    jobId: serial("id").primaryKey(),
    jobRole: varchar("job_role", { length: 100 }).notNull(),
    description: text("description").notNull(),
    techStack: varchar("tech_stack", { length: 255 }).notNull(),
    experience: integer("experience").notNull(),
    location: varchar("location", { length: 100 }).notNull(),
    closedAt: varchar("closed_at", { length: 100 }).notNull(),
    companyId: integer("company_id").notNull().references(() => companies.companyId),
    recruiterId: integer("recruiter_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});