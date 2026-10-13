import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "supporters" ADD COLUMN "website" varchar;
  ALTER TABLE "_supporters_v" ADD COLUMN "version_website" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "supporters" DROP COLUMN "website";
  ALTER TABLE "_supporters_v" DROP COLUMN "version_website";`)
}
