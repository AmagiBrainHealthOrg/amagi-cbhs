import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_schedule_day_notes_day" AS ENUM('2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22');
  CREATE TYPE "public"."enum_pages_blocks_schedule_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_schedule_day_notes_day" AS ENUM('2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22');
  CREATE TYPE "public"."enum__pages_v_blocks_schedule_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_sessions_day" AS ENUM('2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22');
  CREATE TYPE "public"."enum_sessions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sessions_v_version_day" AS ENUM('2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22');
  CREATE TYPE "public"."enum__sessions_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_session_locations_time_zone" AS ENUM('America/Jamaica', 'America/Cayman', 'America/Nassau', 'America/Barbados', 'America/Port_of_Spain', 'America/Puerto_Rico', 'America/Guyana', 'America/Paramaribo', 'America/Belize');
  CREATE TYPE "public"."enum_session_locations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__session_locations_v_version_time_zone" AS ENUM('America/Jamaica', 'America/Cayman', 'America/Nassau', 'America/Barbados', 'America/Port_of_Spain', 'America/Puerto_Rico', 'America/Guyana', 'America/Paramaribo', 'America/Belize');
  CREATE TYPE "public"."enum__session_locations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_session_themes_colour" AS ENUM('blue', 'red', 'orange', 'yellow', 'teal', 'purple', 'green');
  CREATE TYPE "public"."enum_session_themes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__session_themes_v_version_colour" AS ENUM('blue', 'red', 'orange', 'yellow', 'teal', 'purple', 'green');
  CREATE TYPE "public"."enum__session_themes_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_form_submissions_form" ADD VALUE 'session-registration';
  ALTER TYPE "public"."enum_forms_thank_you_form" ADD VALUE 'session-registration';
  ALTER TYPE "public"."enum__forms_v_version_thank_you_form" ADD VALUE 'session-registration';
  CREATE TABLE "pages_blocks_schedule_day_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_pages_blocks_schedule_day_notes_day",
  	"note" varchar,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_schedule_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_schedule_day_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum__pages_v_blocks_schedule_day_notes_day",
  	"note" varchar,
  	"highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_schedule_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"location_id" integer,
  	"theme_id" integer,
  	"day" "enum_sessions_day",
  	"start_time" varchar,
  	"end_time" varchar,
  	"venue" varchar,
  	"description" varchar,
  	"zoom_url" varchar,
  	"registration_open" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sessions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_sessions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_location_id" integer,
  	"version_theme_id" integer,
  	"version_day" "enum__sessions_v_version_day",
  	"version_start_time" varchar,
  	"version_end_time" varchar,
  	"version_venue" varchar,
  	"version_description" varchar,
  	"version_zoom_url" varchar,
  	"version_registration_open" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sessions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "session_locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"city" varchar,
  	"online" boolean DEFAULT false,
  	"time_zone" "enum_session_locations_time_zone" DEFAULT 'America/Jamaica',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_session_locations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_session_locations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_city" varchar,
  	"version_online" boolean DEFAULT false,
  	"version_time_zone" "enum__session_locations_v_version_time_zone" DEFAULT 'America/Jamaica',
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__session_locations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "session_themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"colour" "enum_session_themes_colour" DEFAULT 'blue',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_session_themes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_session_themes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_colour" "enum__session_themes_v_version_colour" DEFAULT 'blue',
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__session_themes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "form_submissions" ADD COLUMN "session_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sessions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "session_locations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "session_themes_id" integer;
  ALTER TABLE "pages_blocks_schedule_day_notes" ADD CONSTRAINT "pages_blocks_schedule_day_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_schedule" ADD CONSTRAINT "pages_blocks_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_schedule_day_notes" ADD CONSTRAINT "_pages_v_blocks_schedule_day_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_schedule" ADD CONSTRAINT "_pages_v_blocks_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_location_id_session_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."session_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_theme_id_session_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."session_themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sessions_v" ADD CONSTRAINT "_sessions_v_parent_id_sessions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sessions_v" ADD CONSTRAINT "_sessions_v_version_location_id_session_locations_id_fk" FOREIGN KEY ("version_location_id") REFERENCES "public"."session_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sessions_v" ADD CONSTRAINT "_sessions_v_version_theme_id_session_themes_id_fk" FOREIGN KEY ("version_theme_id") REFERENCES "public"."session_themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_session_locations_v" ADD CONSTRAINT "_session_locations_v_parent_id_session_locations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."session_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_session_themes_v" ADD CONSTRAINT "_session_themes_v_parent_id_session_themes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."session_themes"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_schedule_day_notes_order_idx" ON "pages_blocks_schedule_day_notes" USING btree ("_order");
  CREATE INDEX "pages_blocks_schedule_day_notes_parent_id_idx" ON "pages_blocks_schedule_day_notes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_schedule_order_idx" ON "pages_blocks_schedule" USING btree ("_order");
  CREATE INDEX "pages_blocks_schedule_parent_id_idx" ON "pages_blocks_schedule" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_schedule_path_idx" ON "pages_blocks_schedule" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_schedule_day_notes_order_idx" ON "_pages_v_blocks_schedule_day_notes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_schedule_day_notes_parent_id_idx" ON "_pages_v_blocks_schedule_day_notes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_schedule_order_idx" ON "_pages_v_blocks_schedule" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_schedule_parent_id_idx" ON "_pages_v_blocks_schedule" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_schedule_path_idx" ON "_pages_v_blocks_schedule" USING btree ("_path");
  CREATE UNIQUE INDEX "sessions_slug_idx" ON "sessions" USING btree ("slug");
  CREATE INDEX "sessions_location_idx" ON "sessions" USING btree ("location_id");
  CREATE INDEX "sessions_theme_idx" ON "sessions" USING btree ("theme_id");
  CREATE INDEX "sessions_day_idx" ON "sessions" USING btree ("day");
  CREATE INDEX "sessions_updated_at_idx" ON "sessions" USING btree ("updated_at");
  CREATE INDEX "sessions_created_at_idx" ON "sessions" USING btree ("created_at");
  CREATE INDEX "sessions__status_idx" ON "sessions" USING btree ("_status");
  CREATE INDEX "_sessions_v_parent_idx" ON "_sessions_v" USING btree ("parent_id");
  CREATE INDEX "_sessions_v_version_version_slug_idx" ON "_sessions_v" USING btree ("version_slug");
  CREATE INDEX "_sessions_v_version_version_location_idx" ON "_sessions_v" USING btree ("version_location_id");
  CREATE INDEX "_sessions_v_version_version_theme_idx" ON "_sessions_v" USING btree ("version_theme_id");
  CREATE INDEX "_sessions_v_version_version_day_idx" ON "_sessions_v" USING btree ("version_day");
  CREATE INDEX "_sessions_v_version_version_updated_at_idx" ON "_sessions_v" USING btree ("version_updated_at");
  CREATE INDEX "_sessions_v_version_version_created_at_idx" ON "_sessions_v" USING btree ("version_created_at");
  CREATE INDEX "_sessions_v_version_version__status_idx" ON "_sessions_v" USING btree ("version__status");
  CREATE INDEX "_sessions_v_created_at_idx" ON "_sessions_v" USING btree ("created_at");
  CREATE INDEX "_sessions_v_updated_at_idx" ON "_sessions_v" USING btree ("updated_at");
  CREATE INDEX "_sessions_v_latest_idx" ON "_sessions_v" USING btree ("latest");
  CREATE INDEX "_sessions_v_autosave_idx" ON "_sessions_v" USING btree ("autosave");
  CREATE INDEX "session_locations_updated_at_idx" ON "session_locations" USING btree ("updated_at");
  CREATE INDEX "session_locations_created_at_idx" ON "session_locations" USING btree ("created_at");
  CREATE INDEX "session_locations__status_idx" ON "session_locations" USING btree ("_status");
  CREATE INDEX "_session_locations_v_parent_idx" ON "_session_locations_v" USING btree ("parent_id");
  CREATE INDEX "_session_locations_v_version_version_updated_at_idx" ON "_session_locations_v" USING btree ("version_updated_at");
  CREATE INDEX "_session_locations_v_version_version_created_at_idx" ON "_session_locations_v" USING btree ("version_created_at");
  CREATE INDEX "_session_locations_v_version_version__status_idx" ON "_session_locations_v" USING btree ("version__status");
  CREATE INDEX "_session_locations_v_created_at_idx" ON "_session_locations_v" USING btree ("created_at");
  CREATE INDEX "_session_locations_v_updated_at_idx" ON "_session_locations_v" USING btree ("updated_at");
  CREATE INDEX "_session_locations_v_latest_idx" ON "_session_locations_v" USING btree ("latest");
  CREATE INDEX "_session_locations_v_autosave_idx" ON "_session_locations_v" USING btree ("autosave");
  CREATE INDEX "session_themes_updated_at_idx" ON "session_themes" USING btree ("updated_at");
  CREATE INDEX "session_themes_created_at_idx" ON "session_themes" USING btree ("created_at");
  CREATE INDEX "session_themes__status_idx" ON "session_themes" USING btree ("_status");
  CREATE INDEX "_session_themes_v_parent_idx" ON "_session_themes_v" USING btree ("parent_id");
  CREATE INDEX "_session_themes_v_version_version_updated_at_idx" ON "_session_themes_v" USING btree ("version_updated_at");
  CREATE INDEX "_session_themes_v_version_version_created_at_idx" ON "_session_themes_v" USING btree ("version_created_at");
  CREATE INDEX "_session_themes_v_version_version__status_idx" ON "_session_themes_v" USING btree ("version__status");
  CREATE INDEX "_session_themes_v_created_at_idx" ON "_session_themes_v" USING btree ("created_at");
  CREATE INDEX "_session_themes_v_updated_at_idx" ON "_session_themes_v" USING btree ("updated_at");
  CREATE INDEX "_session_themes_v_latest_idx" ON "_session_themes_v" USING btree ("latest");
  CREATE INDEX "_session_themes_v_autosave_idx" ON "_session_themes_v" USING btree ("autosave");
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_session_locations_fk" FOREIGN KEY ("session_locations_id") REFERENCES "public"."session_locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_session_themes_fk" FOREIGN KEY ("session_themes_id") REFERENCES "public"."session_themes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "form_submissions_session_idx" ON "form_submissions" USING btree ("session_id");
  CREATE INDEX "payload_locked_documents_rels_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("sessions_id");
  CREATE INDEX "payload_locked_documents_rels_session_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("session_locations_id");
  CREATE INDEX "payload_locked_documents_rels_session_themes_id_idx" ON "payload_locked_documents_rels" USING btree ("session_themes_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_schedule_day_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_schedule" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_schedule_day_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_schedule" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sessions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "session_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_session_locations_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "session_themes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_session_themes_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_schedule_day_notes" CASCADE;
  DROP TABLE "pages_blocks_schedule" CASCADE;
  DROP TABLE "_pages_v_blocks_schedule_day_notes" CASCADE;
  DROP TABLE "_pages_v_blocks_schedule" CASCADE;
  DROP TABLE "sessions" CASCADE;
  DROP TABLE "_sessions_v" CASCADE;
  DROP TABLE "session_locations" CASCADE;
  DROP TABLE "_session_locations_v" CASCADE;
  DROP TABLE "session_themes" CASCADE;
  DROP TABLE "_session_themes_v" CASCADE;
  ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_session_id_sessions_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sessions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_session_locations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_session_themes_fk";
  
  ALTER TABLE "form_submissions" ALTER COLUMN "form" SET DATA TYPE text;
  DROP TYPE "public"."enum_form_submissions_form";
  CREATE TYPE "public"."enum_form_submissions_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  ALTER TABLE "form_submissions" ALTER COLUMN "form" SET DATA TYPE "public"."enum_form_submissions_form" USING "form"::"public"."enum_form_submissions_form";
  ALTER TABLE "forms_thank_you" ALTER COLUMN "form" SET DATA TYPE text;
  DROP TYPE "public"."enum_forms_thank_you_form";
  CREATE TYPE "public"."enum_forms_thank_you_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  ALTER TABLE "forms_thank_you" ALTER COLUMN "form" SET DATA TYPE "public"."enum_forms_thank_you_form" USING "form"::"public"."enum_forms_thank_you_form";
  ALTER TABLE "_forms_v_version_thank_you" ALTER COLUMN "form" SET DATA TYPE text;
  DROP TYPE "public"."enum__forms_v_version_thank_you_form";
  CREATE TYPE "public"."enum__forms_v_version_thank_you_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  ALTER TABLE "_forms_v_version_thank_you" ALTER COLUMN "form" SET DATA TYPE "public"."enum__forms_v_version_thank_you_form" USING "form"::"public"."enum__forms_v_version_thank_you_form";
  DROP INDEX "form_submissions_session_idx";
  DROP INDEX "payload_locked_documents_rels_sessions_id_idx";
  DROP INDEX "payload_locked_documents_rels_session_locations_id_idx";
  DROP INDEX "payload_locked_documents_rels_session_themes_id_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "session_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sessions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "session_locations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "session_themes_id";
  DROP TYPE "public"."enum_pages_blocks_schedule_day_notes_day";
  DROP TYPE "public"."enum_pages_blocks_schedule_background";
  DROP TYPE "public"."enum__pages_v_blocks_schedule_day_notes_day";
  DROP TYPE "public"."enum__pages_v_blocks_schedule_background";
  DROP TYPE "public"."enum_sessions_day";
  DROP TYPE "public"."enum_sessions_status";
  DROP TYPE "public"."enum__sessions_v_version_day";
  DROP TYPE "public"."enum__sessions_v_version_status";
  DROP TYPE "public"."enum_session_locations_time_zone";
  DROP TYPE "public"."enum_session_locations_status";
  DROP TYPE "public"."enum__session_locations_v_version_time_zone";
  DROP TYPE "public"."enum__session_locations_v_version_status";
  DROP TYPE "public"."enum_session_themes_colour";
  DROP TYPE "public"."enum_session_themes_status";
  DROP TYPE "public"."enum__session_themes_v_version_colour";
  DROP TYPE "public"."enum__session_themes_v_version_status";`)
}
