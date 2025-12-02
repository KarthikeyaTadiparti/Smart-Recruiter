import { pgTable, varchar, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { jobs } from "./jobs-schema.ts";

export const interviews = pgTable("interviews", {
    interviewId: serial("id").primaryKey(),
    interviewType: varchar("interview_type", { length: 100 }).notNull(),
    interviewDuration: integer("interview_duration").notNull(),
    noOfQuestions: integer("no_of_questions").notNull(),
    jobId : integer("job_id").notNull().references(() => jobs.jobId),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

