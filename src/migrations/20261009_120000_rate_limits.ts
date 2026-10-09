import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// SPEC §8.2 step 2. Outside Payload's schema: only src/lib/rateLimit.ts reads and writes it.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "rate_limits" (
   	"key" varchar NOT NULL,
   	"window_start" timestamp(3) with time zone NOT NULL,
   	"count" integer DEFAULT 0 NOT NULL,
   	PRIMARY KEY ("key", "window_start")
   );
   ALTER TABLE "rate_limits" ENABLE ROW LEVEL SECURITY;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "rate_limits";`)
}
