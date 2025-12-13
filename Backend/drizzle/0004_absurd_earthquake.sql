ALTER TABLE "companies" DROP CONSTRAINT "companies_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "created_by";