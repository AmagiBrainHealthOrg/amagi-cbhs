import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_logo_grid_display" AS ENUM('grid', 'marquee');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_grid_display" AS ENUM('grid', 'marquee');
  ALTER TABLE "pages_blocks_logo_grid" ADD COLUMN "display" "enum_pages_blocks_logo_grid_display" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_logo_grid" ADD COLUMN "display" "enum__pages_v_blocks_logo_grid_display" DEFAULT 'grid';
  ALTER TABLE "partners" ADD COLUMN "order" numeric;
  ALTER TABLE "_partners_v" ADD COLUMN "version_order" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_logo_grid" DROP COLUMN "display";
  ALTER TABLE "_pages_v_blocks_logo_grid" DROP COLUMN "display";
  ALTER TABLE "partners" DROP COLUMN "order";
  ALTER TABLE "_partners_v" DROP COLUMN "version_order";
  DROP TYPE "public"."enum_pages_blocks_logo_grid_display";
  DROP TYPE "public"."enum__pages_v_blocks_logo_grid_display";`)
}
