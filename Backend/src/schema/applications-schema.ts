import {
    integer,
    serial,
    timestamp,
    pgTable,
    decimal,
    jsonb,
    text,
} from "drizzle-orm/pg-core";
import { users } from "./users-schema.ts";
import { jobs } from "./jobs-schema.ts";

export const applications = pgTable("applications", {
    applicationId: serial("id").primaryKey(),

    candidateId: integer("candidate_id")
        .notNull()
        .references(() => users.id),

    jobId: integer("job_id")
        .notNull()
        .references(() => jobs.jobId),

    technicalScore: decimal("technical_score", {
        precision: 4,
        scale: 2,
        mode: "number",
    }).notNull(),

    communicationScore: decimal("communication_score", {
        precision: 4,
        scale: 2,
        mode: "number",
    }).notNull(),

    confidenceScore: decimal("confidence_score", {
        precision: 4,
        scale: 2,
        mode: "number",
    }).notNull(),

    overallScore: decimal("overall_score", {
        precision: 4,
        scale: 2,
        mode: "number",
    }).notNull(),


    tabSwitches: integer("tabswitches").notNull(),

    conversation: jsonb("conversation").notNull(),
    questionAnswers: jsonb("question_answers").notNull(),

    feedback: text("feedback").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
