import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Add the column nullable first so existing users can be told apart from new ones and backfilled to admin.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
   EXCEPTION WHEN duplicate_object THEN NULL;
   END $$;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "enum_users_role";
  UPDATE "users" SET "role" = 'admin' WHERE "role" IS NULL;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor';
  ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
  DROP TYPE IF EXISTS "public"."enum_users_role";`)
}
