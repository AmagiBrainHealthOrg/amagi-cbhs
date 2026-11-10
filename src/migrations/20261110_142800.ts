import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_countries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__countries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_country_pages_take_part_cards_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  CREATE TYPE "public"."enum_country_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__country_pages_v_version_take_part_cards_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  CREATE TYPE "public"."enum__country_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"location_id" integer,
  	"tagline" varchar,
  	"intro" varchar,
  	"hosts" varchar,
  	"anchor_day" boolean DEFAULT false,
  	"priorities_question" varchar,
  	"priorities_strengths" varchar,
  	"priorities_next_step" varchar,
  	"priorities_regional" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_countries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_countries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_location_id" integer,
  	"version_tagline" varchar,
  	"version_intro" varchar,
  	"version_hosts" varchar,
  	"version_anchor_day" boolean DEFAULT false,
  	"version_priorities_question" varchar,
  	"version_priorities_strengths" varchar,
  	"version_priorities_next_step" varchar,
  	"version_priorities_regional" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__countries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "country_pages_take_part_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_country_pages_take_part_cards_icon",
  	"title" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "country_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"index_kicker" varchar,
  	"index_heading" varchar,
  	"index_lead" varchar,
  	"programme_heading" varchar,
  	"programme_intro" varchar,
  	"programme_time_zone_note" varchar,
  	"anchor_day_heading" varchar,
  	"anchor_day_when" varchar,
  	"anchor_day_body" varchar,
  	"hosts_heading" varchar,
  	"hosts_note" varchar,
  	"priorities_heading" varchar,
  	"priorities_intro" varchar,
  	"priorities_question_label" varchar,
  	"priorities_strengths_label" varchar,
  	"priorities_next_step_label" varchar,
  	"priorities_regional_label" varchar,
  	"take_part_heading" varchar,
  	"take_part_stay_connected_label" varchar,
  	"take_part_stay_connected" varchar,
  	"beyond_heading" varchar,
  	"beyond_body" varchar,
  	"about_heading" varchar,
  	"about_body" varchar,
  	"_status" "enum_country_pages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_country_pages_v_version_take_part_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__country_pages_v_version_take_part_cards_icon",
  	"title" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_country_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_index_kicker" varchar,
  	"version_index_heading" varchar,
  	"version_index_lead" varchar,
  	"version_programme_heading" varchar,
  	"version_programme_intro" varchar,
  	"version_programme_time_zone_note" varchar,
  	"version_anchor_day_heading" varchar,
  	"version_anchor_day_when" varchar,
  	"version_anchor_day_body" varchar,
  	"version_hosts_heading" varchar,
  	"version_hosts_note" varchar,
  	"version_priorities_heading" varchar,
  	"version_priorities_intro" varchar,
  	"version_priorities_question_label" varchar,
  	"version_priorities_strengths_label" varchar,
  	"version_priorities_next_step_label" varchar,
  	"version_priorities_regional_label" varchar,
  	"version_take_part_heading" varchar,
  	"version_take_part_stay_connected_label" varchar,
  	"version_take_part_stay_connected" varchar,
  	"version_beyond_heading" varchar,
  	"version_beyond_body" varchar,
  	"version_about_heading" varchar,
  	"version_about_body" varchar,
  	"version__status" "enum__country_pages_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "countries_id" integer;
  ALTER TABLE "countries" ADD CONSTRAINT "countries_location_id_session_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."session_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_countries_v" ADD CONSTRAINT "_countries_v_parent_id_countries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_countries_v" ADD CONSTRAINT "_countries_v_version_location_id_session_locations_id_fk" FOREIGN KEY ("version_location_id") REFERENCES "public"."session_locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "country_pages_take_part_cards" ADD CONSTRAINT "country_pages_take_part_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."country_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_country_pages_v_version_take_part_cards" ADD CONSTRAINT "_country_pages_v_version_take_part_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_country_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "countries_slug_idx" ON "countries" USING btree ("slug");
  CREATE UNIQUE INDEX "countries_location_idx" ON "countries" USING btree ("location_id");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE INDEX "countries__status_idx" ON "countries" USING btree ("_status");
  CREATE INDEX "_countries_v_parent_idx" ON "_countries_v" USING btree ("parent_id");
  CREATE INDEX "_countries_v_version_version_slug_idx" ON "_countries_v" USING btree ("version_slug");
  CREATE INDEX "_countries_v_version_version_location_idx" ON "_countries_v" USING btree ("version_location_id");
  CREATE INDEX "_countries_v_version_version_updated_at_idx" ON "_countries_v" USING btree ("version_updated_at");
  CREATE INDEX "_countries_v_version_version_created_at_idx" ON "_countries_v" USING btree ("version_created_at");
  CREATE INDEX "_countries_v_version_version__status_idx" ON "_countries_v" USING btree ("version__status");
  CREATE INDEX "_countries_v_created_at_idx" ON "_countries_v" USING btree ("created_at");
  CREATE INDEX "_countries_v_updated_at_idx" ON "_countries_v" USING btree ("updated_at");
  CREATE INDEX "_countries_v_latest_idx" ON "_countries_v" USING btree ("latest");
  CREATE INDEX "_countries_v_autosave_idx" ON "_countries_v" USING btree ("autosave");
  CREATE INDEX "country_pages_take_part_cards_order_idx" ON "country_pages_take_part_cards" USING btree ("_order");
  CREATE INDEX "country_pages_take_part_cards_parent_id_idx" ON "country_pages_take_part_cards" USING btree ("_parent_id");
  CREATE INDEX "country_pages__status_idx" ON "country_pages" USING btree ("_status");
  CREATE INDEX "_country_pages_v_version_take_part_cards_order_idx" ON "_country_pages_v_version_take_part_cards" USING btree ("_order");
  CREATE INDEX "_country_pages_v_version_take_part_cards_parent_id_idx" ON "_country_pages_v_version_take_part_cards" USING btree ("_parent_id");
  CREATE INDEX "_country_pages_v_version_version__status_idx" ON "_country_pages_v" USING btree ("version__status");
  CREATE INDEX "_country_pages_v_created_at_idx" ON "_country_pages_v" USING btree ("created_at");
  CREATE INDEX "_country_pages_v_updated_at_idx" ON "_country_pages_v" USING btree ("updated_at");
  CREATE INDEX "_country_pages_v_latest_idx" ON "_country_pages_v" USING btree ("latest");
  CREATE INDEX "_country_pages_v_autosave_idx" ON "_country_pages_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "countries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_countries_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "country_pages_take_part_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "country_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_country_pages_v_version_take_part_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_country_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "_countries_v" CASCADE;
  DROP TABLE "country_pages_take_part_cards" CASCADE;
  DROP TABLE "country_pages" CASCADE;
  DROP TABLE "_country_pages_v_version_take_part_cards" CASCADE;
  DROP TABLE "_country_pages_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_countries_fk";
  
  DROP INDEX "payload_locked_documents_rels_countries_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "countries_id";
  DROP TYPE "public"."enum_countries_status";
  DROP TYPE "public"."enum__countries_v_version_status";
  DROP TYPE "public"."enum_country_pages_take_part_cards_icon";
  DROP TYPE "public"."enum_country_pages_status";
  DROP TYPE "public"."enum__country_pages_v_version_take_part_cards_icon";
  DROP TYPE "public"."enum__country_pages_v_version_status";`)
}
