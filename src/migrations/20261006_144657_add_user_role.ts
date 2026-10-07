import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
   EXCEPTION WHEN duplicate_object THEN NULL;
   END $$;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  UPDATE "users" SET "role" = 'admin' WHERE "role" = 'editor';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
  DROP TYPE IF EXISTS "public"."enum_users_role";`)
}
