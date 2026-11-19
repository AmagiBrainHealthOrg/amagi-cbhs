import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sessions" ADD COLUMN "youtube_video" varchar;
  ALTER TABLE "_sessions_v" ADD COLUMN "version_youtube_video" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sessions" DROP COLUMN "youtube_video";
  ALTER TABLE "_sessions_v" DROP COLUMN "version_youtube_video";`)
}
