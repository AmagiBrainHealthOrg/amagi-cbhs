import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" ADD COLUMN "countdown_units_days" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "countdown_units_hours" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "countdown_units_minutes" varchar;
  ALTER TABLE "pages_blocks_host_map" ADD COLUMN "anchor_label" varchar;
  ALTER TABLE "pages_blocks_summit_week" ADD COLUMN "month_label" varchar;
  ALTER TABLE "pages_blocks_roadmap" ADD COLUMN "status_labels_done" varchar;
  ALTER TABLE "pages_blocks_roadmap" ADD COLUMN "status_labels_now" varchar;
  ALTER TABLE "pages_blocks_roadmap" ADD COLUMN "status_labels_next" varchar;
  ALTER TABLE "pages_blocks_news_teaser" ADD COLUMN "show_all" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "countdown_units_days" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "countdown_units_hours" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "countdown_units_minutes" varchar;
  ALTER TABLE "_pages_v_blocks_host_map" ADD COLUMN "anchor_label" varchar;
  ALTER TABLE "_pages_v_blocks_summit_week" ADD COLUMN "month_label" varchar;
  ALTER TABLE "_pages_v_blocks_roadmap" ADD COLUMN "status_labels_done" varchar;
  ALTER TABLE "_pages_v_blocks_roadmap" ADD COLUMN "status_labels_now" varchar;
  ALTER TABLE "_pages_v_blocks_roadmap" ADD COLUMN "status_labels_next" varchar;
  ALTER TABLE "_pages_v_blocks_news_teaser" ADD COLUMN "show_all" boolean DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" DROP COLUMN "countdown_units_days";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "countdown_units_hours";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "countdown_units_minutes";
  ALTER TABLE "pages_blocks_host_map" DROP COLUMN "anchor_label";
  ALTER TABLE "pages_blocks_summit_week" DROP COLUMN "month_label";
  ALTER TABLE "pages_blocks_roadmap" DROP COLUMN "status_labels_done";
  ALTER TABLE "pages_blocks_roadmap" DROP COLUMN "status_labels_now";
  ALTER TABLE "pages_blocks_roadmap" DROP COLUMN "status_labels_next";
  ALTER TABLE "pages_blocks_news_teaser" DROP COLUMN "show_all";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "countdown_units_days";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "countdown_units_hours";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "countdown_units_minutes";
  ALTER TABLE "_pages_v_blocks_host_map" DROP COLUMN "anchor_label";
  ALTER TABLE "_pages_v_blocks_summit_week" DROP COLUMN "month_label";
  ALTER TABLE "_pages_v_blocks_roadmap" DROP COLUMN "status_labels_done";
  ALTER TABLE "_pages_v_blocks_roadmap" DROP COLUMN "status_labels_now";
  ALTER TABLE "_pages_v_blocks_roadmap" DROP COLUMN "status_labels_next";
  ALTER TABLE "_pages_v_blocks_news_teaser" DROP COLUMN "show_all";`)
}
