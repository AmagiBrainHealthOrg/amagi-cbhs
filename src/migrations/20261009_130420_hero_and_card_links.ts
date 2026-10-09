import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_card_grid_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "extra_link_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "extra_link_href" varchar;
  ALTER TABLE "pages_blocks_card_grid_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_card_grid_items" ADD COLUMN "link_href" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "extra_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "extra_link_href" varchar;
  ALTER TABLE "_pages_v_blocks_card_grid_items" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_card_grid_items" ADD COLUMN "link_href" varchar;
  ALTER TABLE "pages_blocks_card_grid_links" ADD CONSTRAINT "pages_blocks_card_grid_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_links" ADD CONSTRAINT "_pages_v_blocks_card_grid_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_card_grid_links_order_idx" ON "pages_blocks_card_grid_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_links_parent_id_idx" ON "pages_blocks_card_grid_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_links_order_idx" ON "_pages_v_blocks_card_grid_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_links_parent_id_idx" ON "_pages_v_blocks_card_grid_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_card_grid_links" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_links" CASCADE;
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "extra_link_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "extra_link_href";
  ALTER TABLE "pages_blocks_card_grid_items" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_card_grid_items" DROP COLUMN "link_href";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "extra_link_label";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "extra_link_href";
  ALTER TABLE "_pages_v_blocks_card_grid_items" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_card_grid_items" DROP COLUMN "link_href";`)
}
