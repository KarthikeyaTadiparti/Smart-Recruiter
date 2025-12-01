// import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";

// export const interviews = pgTable("interviews", {
//     jobRole: varchar("job_role", { length: 100 }).notNull(),
//     techStack: varchar("tech_stack", { length: 100 }).notNull(),
//     experience: varchar("experience", { length: 100 }).notNull(),
//     interviewType: varchar("interview_type", { length: 100 }).notNull(),
//     interviewDuration: integer("interview_duration").notNull(),
//     createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
// });

// //extra fields like company details, recruiter details 