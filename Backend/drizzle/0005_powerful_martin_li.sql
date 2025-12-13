ALTER TABLE "jobs" ADD COLUMN "interview_type" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "interview_duration" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "no_of_questions" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "questions" jsonb;