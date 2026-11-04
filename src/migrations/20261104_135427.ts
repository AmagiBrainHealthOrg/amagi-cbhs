import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sessions_registration_options_method" AS ENUM('form', 'link');
  CREATE TYPE "public"."enum__sessions_v_version_registration_options_method" AS ENUM('form', 'link');
  CREATE TABLE "sessions_registration_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"method" "enum_sessions_registration_options_method" DEFAULT 'form',
  	"url" varchar
  );
  
  CREATE TABLE "_sessions_v_version_registration_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"method" "enum__sessions_v_version_registration_options_method" DEFAULT 'form',
  	"url" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "sessions_registration_options" ADD CONSTRAINT "sessions_registration_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sessions_v_version_registration_options" ADD CONSTRAINT "_sessions_v_version_registration_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sessions_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sessions_registration_options_order_idx" ON "sessions_registration_options" USING btree ("_order");
  CREATE INDEX "sessions_registration_options_parent_id_idx" ON "sessions_registration_options" USING btree ("_parent_id");
  CREATE INDEX "_sessions_v_version_registration_options_order_idx" ON "_sessions_v_version_registration_options" USING btree ("_order");
  CREATE INDEX "_sessions_v_version_registration_options_parent_id_idx" ON "_sessions_v_version_registration_options" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "sessions_registration_options" CASCADE;
  DROP TABLE "_sessions_v_version_registration_options" CASCADE;
  DROP TYPE "public"."enum_sessions_registration_options_method";
  DROP TYPE "public"."enum__sessions_v_version_registration_options_method";`)
}
