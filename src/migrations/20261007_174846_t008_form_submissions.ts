import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_form_submissions_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  CREATE TYPE "public"."enum_form_submissions_airtable_sync_status" AS ENUM('pending', 'synced', 'failed');
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form" "enum_form_submissions_form" NOT NULL,
  	"data" jsonb NOT NULL,
  	"territory" varchar,
  	"audience_type" varchar,
  	"consents_contact" boolean DEFAULT false,
  	"consents_public_name" boolean DEFAULT false,
  	"consents_share_story" boolean DEFAULT false,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_term" varchar,
  	"utm_content" varchar,
  	"is_test" boolean DEFAULT false,
  	"airtable_sync_status" "enum_form_submissions_airtable_sync_status" DEFAULT 'pending' NOT NULL,
  	"airtable_sync_error" varchar,
  	"airtable_record_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form");
  CREATE INDEX "form_submissions_territory_idx" ON "form_submissions" USING btree ("territory");
  CREATE INDEX "form_submissions_airtable_sync_status_idx" ON "form_submissions" USING btree ("airtable_sync_status");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  ALTER TABLE "form_submissions" ENABLE ROW LEVEL SECURITY;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  DROP TABLE "form_submissions";
  DROP TYPE "public"."enum_form_submissions_form";
  DROP TYPE "public"."enum_form_submissions_airtable_sync_status";`)
}
