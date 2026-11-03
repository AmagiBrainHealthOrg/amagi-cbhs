import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_summit_week_days_day" AS ENUM('2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22');
  CREATE TYPE "public"."enum_summit_week_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__summit_week_v_version_days_day" AS ENUM('2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22');
  CREATE TYPE "public"."enum__summit_week_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "summit_week_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_summit_week_days_day",
  	"label" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "summit_week" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_summit_week_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_summit_week_v_version_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum__summit_week_v_version_days_day",
  	"label" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_summit_week_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__summit_week_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "summit_week_days" ADD CONSTRAINT "summit_week_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."summit_week"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_summit_week_v_version_days" ADD CONSTRAINT "_summit_week_v_version_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_summit_week_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "summit_week_days_order_idx" ON "summit_week_days" USING btree ("_order");
  CREATE INDEX "summit_week_days_parent_id_idx" ON "summit_week_days" USING btree ("_parent_id");
  CREATE INDEX "summit_week__status_idx" ON "summit_week" USING btree ("_status");
  CREATE INDEX "_summit_week_v_version_days_order_idx" ON "_summit_week_v_version_days" USING btree ("_order");
  CREATE INDEX "_summit_week_v_version_days_parent_id_idx" ON "_summit_week_v_version_days" USING btree ("_parent_id");
  CREATE INDEX "_summit_week_v_version_version__status_idx" ON "_summit_week_v" USING btree ("version__status");
  CREATE INDEX "_summit_week_v_created_at_idx" ON "_summit_week_v" USING btree ("created_at");
  CREATE INDEX "_summit_week_v_updated_at_idx" ON "_summit_week_v" USING btree ("updated_at");
  CREATE INDEX "_summit_week_v_latest_idx" ON "_summit_week_v" USING btree ("latest");
  CREATE INDEX "_summit_week_v_autosave_idx" ON "_summit_week_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "summit_week_days" CASCADE;
  DROP TABLE "summit_week" CASCADE;
  DROP TABLE "_summit_week_v_version_days" CASCADE;
  DROP TABLE "_summit_week_v" CASCADE;
  DROP TYPE "public"."enum_summit_week_days_day";
  DROP TYPE "public"."enum_summit_week_status";
  DROP TYPE "public"."enum__summit_week_v_version_days_day";
  DROP TYPE "public"."enum__summit_week_v_version_status";`)
}
