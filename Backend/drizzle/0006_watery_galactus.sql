CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"job_id" integer NOT NULL,
	"technical_score" numeric NOT NULL,
	"communication_score" numeric NOT NULL,
	"confidence_score" numeric NOT NULL,
	"overall_score" numeric NOT NULL,
	"tabswitches" integer NOT NULL,
	"conversation" jsonb NOT NULL,
	"question_answers" jsonb NOT NULL,
	"feedback" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;