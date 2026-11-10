import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sessions" ADD COLUMN "country_id" integer;
  ALTER TABLE "_sessions_v" ADD COLUMN "version_country_id" integer;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sessions_v" ADD CONSTRAINT "_sessions_v_version_country_id_countries_id_fk" FOREIGN KEY ("version_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sessions_country_idx" ON "sessions" USING btree ("country_id");
  CREATE INDEX "_sessions_v_version_version_country_idx" ON "_sessions_v" USING btree ("version_country_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sessions" DROP CONSTRAINT "sessions_country_id_countries_id_fk";
  
  ALTER TABLE "_sessions_v" DROP CONSTRAINT "_sessions_v_version_country_id_countries_id_fk";
  
  DROP INDEX "sessions_country_idx";
  DROP INDEX "_sessions_v_version_version_country_idx";
  ALTER TABLE "sessions" DROP COLUMN "country_id";
  ALTER TABLE "_sessions_v" DROP COLUMN "version_country_id";`)
}
