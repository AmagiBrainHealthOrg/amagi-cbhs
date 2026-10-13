import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_events_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_events_background" AS ENUM('white', 'pale', 'blue');
  CREATE TABLE "pages_blocks_events_groups_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_events_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"online" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show" boolean DEFAULT true,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_events_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_events_groups_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_events_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"online" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show" boolean DEFAULT true,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_events_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_events_groups_events" ADD CONSTRAINT "pages_blocks_events_groups_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_events_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_events_groups" ADD CONSTRAINT "pages_blocks_events_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_events" ADD CONSTRAINT "pages_blocks_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events_groups_events" ADD CONSTRAINT "_pages_v_blocks_events_groups_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_events_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events_groups" ADD CONSTRAINT "_pages_v_blocks_events_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_events" ADD CONSTRAINT "_pages_v_blocks_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_events_groups_events_order_idx" ON "pages_blocks_events_groups_events" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_groups_events_parent_id_idx" ON "pages_blocks_events_groups_events" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_groups_order_idx" ON "pages_blocks_events_groups" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_groups_parent_id_idx" ON "pages_blocks_events_groups" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_order_idx" ON "pages_blocks_events" USING btree ("_order");
  CREATE INDEX "pages_blocks_events_parent_id_idx" ON "pages_blocks_events" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_events_path_idx" ON "pages_blocks_events" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_events_groups_events_order_idx" ON "_pages_v_blocks_events_groups_events" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_groups_events_parent_id_idx" ON "_pages_v_blocks_events_groups_events" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_groups_order_idx" ON "_pages_v_blocks_events_groups" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_groups_parent_id_idx" ON "_pages_v_blocks_events_groups" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_order_idx" ON "_pages_v_blocks_events" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_events_parent_id_idx" ON "_pages_v_blocks_events" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_events_path_idx" ON "_pages_v_blocks_events" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_events_groups_events" CASCADE;
  DROP TABLE "pages_blocks_events_groups" CASCADE;
  DROP TABLE "pages_blocks_events" CASCADE;
  DROP TABLE "_pages_v_blocks_events_groups_events" CASCADE;
  DROP TABLE "_pages_v_blocks_events_groups" CASCADE;
  DROP TABLE "_pages_v_blocks_events" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_events_background";
  DROP TYPE "public"."enum__pages_v_blocks_events_background";`)
}
