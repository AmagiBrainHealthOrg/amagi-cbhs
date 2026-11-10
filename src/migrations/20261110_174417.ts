import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_scale_strip_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_venn_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_funnel_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_comparison_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_scale_strip_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_venn_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_funnel_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_comparison_background" AS ENUM('white', 'pale', 'blue');
  CREATE TABLE "pages_blocks_scale_strip_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_scale_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_scale_strip_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"highlight_label" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_venn_circles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_venn" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_venn_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"centre" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_funnel_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"when" varchar,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_funnel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_funnel_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"end" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison_is_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison_is_not_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_comparison_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"is_heading" varchar,
  	"is_not_heading" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_scale_strip_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"highlight" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_scale_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_scale_strip_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"highlight_label" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_venn_circles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_venn" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_venn_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"centre" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_funnel_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"when" varchar,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_funnel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_funnel_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"end" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_is_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison_is_not_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_comparison" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_comparison_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"is_heading" varchar,
  	"is_not_heading" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_scale_strip_steps" ADD CONSTRAINT "pages_blocks_scale_strip_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_scale_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_scale_strip" ADD CONSTRAINT "pages_blocks_scale_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_venn_circles" ADD CONSTRAINT "pages_blocks_venn_circles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_venn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_venn" ADD CONSTRAINT "pages_blocks_venn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_funnel_steps" ADD CONSTRAINT "pages_blocks_funnel_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_funnel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_funnel" ADD CONSTRAINT "pages_blocks_funnel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_is_items" ADD CONSTRAINT "pages_blocks_comparison_is_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison_is_not_items" ADD CONSTRAINT "pages_blocks_comparison_is_not_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_comparison" ADD CONSTRAINT "pages_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scale_strip_steps" ADD CONSTRAINT "_pages_v_blocks_scale_strip_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_scale_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_scale_strip" ADD CONSTRAINT "_pages_v_blocks_scale_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_venn_circles" ADD CONSTRAINT "_pages_v_blocks_venn_circles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_venn"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_venn" ADD CONSTRAINT "_pages_v_blocks_venn_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_funnel_steps" ADD CONSTRAINT "_pages_v_blocks_funnel_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_funnel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_funnel" ADD CONSTRAINT "_pages_v_blocks_funnel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_is_items" ADD CONSTRAINT "_pages_v_blocks_comparison_is_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison_is_not_items" ADD CONSTRAINT "_pages_v_blocks_comparison_is_not_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_comparison"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_comparison" ADD CONSTRAINT "_pages_v_blocks_comparison_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_scale_strip_steps_order_idx" ON "pages_blocks_scale_strip_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_scale_strip_steps_parent_id_idx" ON "pages_blocks_scale_strip_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_scale_strip_order_idx" ON "pages_blocks_scale_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_scale_strip_parent_id_idx" ON "pages_blocks_scale_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_scale_strip_path_idx" ON "pages_blocks_scale_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_venn_circles_order_idx" ON "pages_blocks_venn_circles" USING btree ("_order");
  CREATE INDEX "pages_blocks_venn_circles_parent_id_idx" ON "pages_blocks_venn_circles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_venn_order_idx" ON "pages_blocks_venn" USING btree ("_order");
  CREATE INDEX "pages_blocks_venn_parent_id_idx" ON "pages_blocks_venn" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_venn_path_idx" ON "pages_blocks_venn" USING btree ("_path");
  CREATE INDEX "pages_blocks_funnel_steps_order_idx" ON "pages_blocks_funnel_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_funnel_steps_parent_id_idx" ON "pages_blocks_funnel_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_funnel_order_idx" ON "pages_blocks_funnel" USING btree ("_order");
  CREATE INDEX "pages_blocks_funnel_parent_id_idx" ON "pages_blocks_funnel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_funnel_path_idx" ON "pages_blocks_funnel" USING btree ("_path");
  CREATE INDEX "pages_blocks_comparison_is_items_order_idx" ON "pages_blocks_comparison_is_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_is_items_parent_id_idx" ON "pages_blocks_comparison_is_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_is_not_items_order_idx" ON "pages_blocks_comparison_is_not_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_is_not_items_parent_id_idx" ON "pages_blocks_comparison_is_not_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_order_idx" ON "pages_blocks_comparison" USING btree ("_order");
  CREATE INDEX "pages_blocks_comparison_parent_id_idx" ON "pages_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_comparison_path_idx" ON "pages_blocks_comparison" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_scale_strip_steps_order_idx" ON "_pages_v_blocks_scale_strip_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_scale_strip_steps_parent_id_idx" ON "_pages_v_blocks_scale_strip_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_scale_strip_order_idx" ON "_pages_v_blocks_scale_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_scale_strip_parent_id_idx" ON "_pages_v_blocks_scale_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_scale_strip_path_idx" ON "_pages_v_blocks_scale_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_venn_circles_order_idx" ON "_pages_v_blocks_venn_circles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_venn_circles_parent_id_idx" ON "_pages_v_blocks_venn_circles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_venn_order_idx" ON "_pages_v_blocks_venn" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_venn_parent_id_idx" ON "_pages_v_blocks_venn" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_venn_path_idx" ON "_pages_v_blocks_venn" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_funnel_steps_order_idx" ON "_pages_v_blocks_funnel_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_funnel_steps_parent_id_idx" ON "_pages_v_blocks_funnel_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_funnel_order_idx" ON "_pages_v_blocks_funnel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_funnel_parent_id_idx" ON "_pages_v_blocks_funnel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_funnel_path_idx" ON "_pages_v_blocks_funnel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_comparison_is_items_order_idx" ON "_pages_v_blocks_comparison_is_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_is_items_parent_id_idx" ON "_pages_v_blocks_comparison_is_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_is_not_items_order_idx" ON "_pages_v_blocks_comparison_is_not_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_is_not_items_parent_id_idx" ON "_pages_v_blocks_comparison_is_not_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_order_idx" ON "_pages_v_blocks_comparison" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_comparison_parent_id_idx" ON "_pages_v_blocks_comparison" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_comparison_path_idx" ON "_pages_v_blocks_comparison" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_scale_strip_steps" CASCADE;
  DROP TABLE "pages_blocks_scale_strip" CASCADE;
  DROP TABLE "pages_blocks_venn_circles" CASCADE;
  DROP TABLE "pages_blocks_venn" CASCADE;
  DROP TABLE "pages_blocks_funnel_steps" CASCADE;
  DROP TABLE "pages_blocks_funnel" CASCADE;
  DROP TABLE "pages_blocks_comparison_is_items" CASCADE;
  DROP TABLE "pages_blocks_comparison_is_not_items" CASCADE;
  DROP TABLE "pages_blocks_comparison" CASCADE;
  DROP TABLE "_pages_v_blocks_scale_strip_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_scale_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_venn_circles" CASCADE;
  DROP TABLE "_pages_v_blocks_venn" CASCADE;
  DROP TABLE "_pages_v_blocks_funnel_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_funnel" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_is_items" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison_is_not_items" CASCADE;
  DROP TABLE "_pages_v_blocks_comparison" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_scale_strip_background";
  DROP TYPE "public"."enum_pages_blocks_venn_background";
  DROP TYPE "public"."enum_pages_blocks_funnel_background";
  DROP TYPE "public"."enum_pages_blocks_comparison_background";
  DROP TYPE "public"."enum__pages_v_blocks_scale_strip_background";
  DROP TYPE "public"."enum__pages_v_blocks_venn_background";
  DROP TYPE "public"."enum__pages_v_blocks_funnel_background";
  DROP TYPE "public"."enum__pages_v_blocks_comparison_background";`)
}
