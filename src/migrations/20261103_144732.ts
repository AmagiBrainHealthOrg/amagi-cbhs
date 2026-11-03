import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_session_locations_time_zone" ADD VALUE 'America/New_York';
  ALTER TYPE "public"."enum__session_locations_v_version_time_zone" ADD VALUE 'America/New_York';
  ALTER TYPE "public"."enum_session_themes_colour" ADD VALUE 'pink';
  ALTER TYPE "public"."enum_session_themes_colour" ADD VALUE 'amber';
  ALTER TYPE "public"."enum__session_themes_v_version_colour" ADD VALUE 'pink';
  ALTER TYPE "public"."enum__session_themes_v_version_colour" ADD VALUE 'amber';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "session_locations" ALTER COLUMN "time_zone" SET DATA TYPE text;
  ALTER TABLE "session_locations" ALTER COLUMN "time_zone" SET DEFAULT 'America/Jamaica'::text;
  DROP TYPE "public"."enum_session_locations_time_zone";
  CREATE TYPE "public"."enum_session_locations_time_zone" AS ENUM('America/Jamaica', 'America/Cayman', 'America/Nassau', 'America/Barbados', 'America/Port_of_Spain', 'America/Puerto_Rico', 'America/Guyana', 'America/Paramaribo', 'America/Belize');
  ALTER TABLE "session_locations" ALTER COLUMN "time_zone" SET DEFAULT 'America/Jamaica'::"public"."enum_session_locations_time_zone";
  ALTER TABLE "session_locations" ALTER COLUMN "time_zone" SET DATA TYPE "public"."enum_session_locations_time_zone" USING "time_zone"::"public"."enum_session_locations_time_zone";
  ALTER TABLE "_session_locations_v" ALTER COLUMN "version_time_zone" SET DATA TYPE text;
  ALTER TABLE "_session_locations_v" ALTER COLUMN "version_time_zone" SET DEFAULT 'America/Jamaica'::text;
  DROP TYPE "public"."enum__session_locations_v_version_time_zone";
  CREATE TYPE "public"."enum__session_locations_v_version_time_zone" AS ENUM('America/Jamaica', 'America/Cayman', 'America/Nassau', 'America/Barbados', 'America/Port_of_Spain', 'America/Puerto_Rico', 'America/Guyana', 'America/Paramaribo', 'America/Belize');
  ALTER TABLE "_session_locations_v" ALTER COLUMN "version_time_zone" SET DEFAULT 'America/Jamaica'::"public"."enum__session_locations_v_version_time_zone";
  ALTER TABLE "_session_locations_v" ALTER COLUMN "version_time_zone" SET DATA TYPE "public"."enum__session_locations_v_version_time_zone" USING "version_time_zone"::"public"."enum__session_locations_v_version_time_zone";
  ALTER TABLE "session_themes" ALTER COLUMN "colour" SET DATA TYPE text;
  ALTER TABLE "session_themes" ALTER COLUMN "colour" SET DEFAULT 'blue'::text;
  DROP TYPE "public"."enum_session_themes_colour";
  CREATE TYPE "public"."enum_session_themes_colour" AS ENUM('blue', 'red', 'orange', 'yellow', 'teal', 'purple', 'green');
  ALTER TABLE "session_themes" ALTER COLUMN "colour" SET DEFAULT 'blue'::"public"."enum_session_themes_colour";
  ALTER TABLE "session_themes" ALTER COLUMN "colour" SET DATA TYPE "public"."enum_session_themes_colour" USING "colour"::"public"."enum_session_themes_colour";
  ALTER TABLE "_session_themes_v" ALTER COLUMN "version_colour" SET DATA TYPE text;
  ALTER TABLE "_session_themes_v" ALTER COLUMN "version_colour" SET DEFAULT 'blue'::text;
  DROP TYPE "public"."enum__session_themes_v_version_colour";
  CREATE TYPE "public"."enum__session_themes_v_version_colour" AS ENUM('blue', 'red', 'orange', 'yellow', 'teal', 'purple', 'green');
  ALTER TABLE "_session_themes_v" ALTER COLUMN "version_colour" SET DEFAULT 'blue'::"public"."enum__session_themes_v_version_colour";
  ALTER TABLE "_session_themes_v" ALTER COLUMN "version_colour" SET DATA TYPE "public"."enum__session_themes_v_version_colour" USING "version_colour"::"public"."enum__session_themes_v_version_colour";`)
}
