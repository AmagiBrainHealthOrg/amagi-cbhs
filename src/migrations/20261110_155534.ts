import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_rich_text_layout" ADD VALUE 'lead';
  ALTER TYPE "public"."enum__pages_v_blocks_rich_text_layout" ADD VALUE 'lead';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_rich_text" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_rich_text" ALTER COLUMN "layout" SET DEFAULT 'split'::text;
  DROP TYPE "public"."enum_pages_blocks_rich_text_layout";
  CREATE TYPE "public"."enum_pages_blocks_rich_text_layout" AS ENUM('split', 'prose');
  ALTER TABLE "pages_blocks_rich_text" ALTER COLUMN "layout" SET DEFAULT 'split'::"public"."enum_pages_blocks_rich_text_layout";
  ALTER TABLE "pages_blocks_rich_text" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_pages_blocks_rich_text_layout" USING "layout"::"public"."enum_pages_blocks_rich_text_layout";
  ALTER TABLE "_pages_v_blocks_rich_text" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_rich_text" ALTER COLUMN "layout" SET DEFAULT 'split'::text;
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_layout";
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_layout" AS ENUM('split', 'prose');
  ALTER TABLE "_pages_v_blocks_rich_text" ALTER COLUMN "layout" SET DEFAULT 'split'::"public"."enum__pages_v_blocks_rich_text_layout";
  ALTER TABLE "_pages_v_blocks_rich_text" ALTER COLUMN "layout" SET DATA TYPE "public"."enum__pages_v_blocks_rich_text_layout" USING "layout"::"public"."enum__pages_v_blocks_rich_text_layout";`)
}
