ALTER TABLE "enquiries" ADD COLUMN "vessel_category_id" uuid;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "operating_region" varchar(200);--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "charter_start" date;--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "charter_duration" varchar(120);--> statement-breakpoint
ALTER TABLE "enquiries" ADD COLUMN "technical_requirements" text;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_vessel_category_id_vessel_categories_id_fk" FOREIGN KEY ("vessel_category_id") REFERENCES "public"."vessel_categories"("id") ON DELETE set null ON UPDATE no action;