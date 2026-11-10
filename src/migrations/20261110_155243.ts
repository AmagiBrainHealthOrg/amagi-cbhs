import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The Anchor Day columns on countries and country_pages are no longer in the config but are
// kept here so the previous deployment can still read them; a later release drops them.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_meta_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock', 'calendar', 'map-pin');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_meta_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock', 'calendar', 'map-pin');
  ALTER TYPE "public"."enum_pages_blocks_card_grid_items_icon" ADD VALUE 'calendar';
  ALTER TYPE "public"."enum_pages_blocks_card_grid_items_icon" ADD VALUE 'map-pin';
  ALTER TYPE "public"."enum_pages_blocks_card_grid_style" ADD VALUE 'numbered';
  ALTER TYPE "public"."enum_pages_blocks_action_areas_areas_icon" ADD VALUE 'calendar';
  ALTER TYPE "public"."enum_pages_blocks_action_areas_areas_icon" ADD VALUE 'map-pin';
  ALTER TYPE "public"."enum__pages_v_blocks_card_grid_items_icon" ADD VALUE 'calendar';
  ALTER TYPE "public"."enum__pages_v_blocks_card_grid_items_icon" ADD VALUE 'map-pin';
  ALTER TYPE "public"."enum__pages_v_blocks_card_grid_style" ADD VALUE 'numbered';
  ALTER TYPE "public"."enum__pages_v_blocks_action_areas_areas_icon" ADD VALUE 'calendar';
  ALTER TYPE "public"."enum__pages_v_blocks_action_areas_areas_icon" ADD VALUE 'map-pin';
  ALTER TYPE "public"."enum_country_pages_take_part_cards_icon" ADD VALUE 'calendar';
  ALTER TYPE "public"."enum_country_pages_take_part_cards_icon" ADD VALUE 'map-pin';
  ALTER TYPE "public"."enum__country_pages_v_version_take_part_cards_icon" ADD VALUE 'calendar';
  ALTER TYPE "public"."enum__country_pages_v_version_take_part_cards_icon" ADD VALUE 'map-pin';
  CREATE TABLE "pages_blocks_hero_meta" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_hero_meta_icon",
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_meta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_hero_meta_icon",
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_roadmap_steps" ADD COLUMN "href" varchar;
  ALTER TABLE "pages_blocks_flow" ADD COLUMN "outro" varchar;
  ALTER TABLE "pages_blocks_card_grid_items" ADD COLUMN "label" varchar;
  ALTER TABLE "_pages_v_blocks_roadmap_steps" ADD COLUMN "href" varchar;
  ALTER TABLE "_pages_v_blocks_flow" ADD COLUMN "outro" varchar;
  ALTER TABLE "_pages_v_blocks_card_grid_items" ADD COLUMN "label" varchar;
  ALTER TABLE "pages_blocks_hero_meta" ADD CONSTRAINT "pages_blocks_hero_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_links" ADD CONSTRAINT "pages_blocks_rich_text_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_meta" ADD CONSTRAINT "_pages_v_blocks_hero_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_links" ADD CONSTRAINT "_pages_v_blocks_rich_text_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_meta_order_idx" ON "pages_blocks_hero_meta" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_meta_parent_id_idx" ON "pages_blocks_hero_meta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_links_order_idx" ON "pages_blocks_rich_text_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_links_parent_id_idx" ON "pages_blocks_rich_text_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_meta_order_idx" ON "_pages_v_blocks_hero_meta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_meta_parent_id_idx" ON "_pages_v_blocks_hero_meta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_links_order_idx" ON "_pages_v_blocks_rich_text_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_links_parent_id_idx" ON "_pages_v_blocks_rich_text_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_meta" CASCADE;
  DROP TABLE "pages_blocks_rich_text_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_meta" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_links" CASCADE;
  ALTER TABLE "pages_blocks_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_card_grid_items_icon";
  CREATE TYPE "public"."enum_pages_blocks_card_grid_items_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  ALTER TABLE "pages_blocks_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_card_grid_items_icon" USING "icon"::"public"."enum_pages_blocks_card_grid_items_icon";
  ALTER TABLE "pages_blocks_card_grid" ALTER COLUMN "style" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_card_grid" ALTER COLUMN "style" SET DEFAULT 'tiles'::text;
  DROP TYPE "public"."enum_pages_blocks_card_grid_style";
  CREATE TYPE "public"."enum_pages_blocks_card_grid_style" AS ENUM('tiles', 'badges');
  ALTER TABLE "pages_blocks_card_grid" ALTER COLUMN "style" SET DEFAULT 'tiles'::"public"."enum_pages_blocks_card_grid_style";
  ALTER TABLE "pages_blocks_card_grid" ALTER COLUMN "style" SET DATA TYPE "public"."enum_pages_blocks_card_grid_style" USING "style"::"public"."enum_pages_blocks_card_grid_style";
  ALTER TABLE "pages_blocks_action_areas_areas" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_action_areas_areas_icon";
  CREATE TYPE "public"."enum_pages_blocks_action_areas_areas_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  ALTER TABLE "pages_blocks_action_areas_areas" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_action_areas_areas_icon" USING "icon"::"public"."enum_pages_blocks_action_areas_areas_icon";
  ALTER TABLE "_pages_v_blocks_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_items_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_items_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  ALTER TABLE "_pages_v_blocks_card_grid_items" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_card_grid_items_icon" USING "icon"::"public"."enum__pages_v_blocks_card_grid_items_icon";
  ALTER TABLE "_pages_v_blocks_card_grid" ALTER COLUMN "style" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_card_grid" ALTER COLUMN "style" SET DEFAULT 'tiles'::text;
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_style";
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_style" AS ENUM('tiles', 'badges');
  ALTER TABLE "_pages_v_blocks_card_grid" ALTER COLUMN "style" SET DEFAULT 'tiles'::"public"."enum__pages_v_blocks_card_grid_style";
  ALTER TABLE "_pages_v_blocks_card_grid" ALTER COLUMN "style" SET DATA TYPE "public"."enum__pages_v_blocks_card_grid_style" USING "style"::"public"."enum__pages_v_blocks_card_grid_style";
  ALTER TABLE "_pages_v_blocks_action_areas_areas" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_action_areas_areas_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_action_areas_areas_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  ALTER TABLE "_pages_v_blocks_action_areas_areas" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_action_areas_areas_icon" USING "icon"::"public"."enum__pages_v_blocks_action_areas_areas_icon";
  ALTER TABLE "country_pages_take_part_cards" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_country_pages_take_part_cards_icon";
  CREATE TYPE "public"."enum_country_pages_take_part_cards_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  ALTER TABLE "country_pages_take_part_cards" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_country_pages_take_part_cards_icon" USING "icon"::"public"."enum_country_pages_take_part_cards_icon";
  ALTER TABLE "_country_pages_v_version_take_part_cards" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum__country_pages_v_version_take_part_cards_icon";
  CREATE TYPE "public"."enum__country_pages_v_version_take_part_cards_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  ALTER TABLE "_country_pages_v_version_take_part_cards" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__country_pages_v_version_take_part_cards_icon" USING "icon"::"public"."enum__country_pages_v_version_take_part_cards_icon";
  ALTER TABLE "pages_blocks_roadmap_steps" DROP COLUMN "href";
  ALTER TABLE "pages_blocks_flow" DROP COLUMN "outro";
  ALTER TABLE "pages_blocks_card_grid_items" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_roadmap_steps" DROP COLUMN "href";
  ALTER TABLE "_pages_v_blocks_flow" DROP COLUMN "outro";
  ALTER TABLE "_pages_v_blocks_card_grid_items" DROP COLUMN "label";
  DROP TYPE "public"."enum_pages_blocks_hero_meta_icon";
  DROP TYPE "public"."enum__pages_v_blocks_hero_meta_icon";`)
}
