import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_form_form" ADD VALUE 'pladrr-eoi';
  ALTER TYPE "public"."enum__pages_v_blocks_form_form" ADD VALUE 'pladrr-eoi';
  ALTER TYPE "public"."enum_form_submissions_form" ADD VALUE 'pladrr-eoi';
  ALTER TYPE "public"."enum_forms_thank_you_form" ADD VALUE 'pladrr-eoi';
  ALTER TYPE "public"."enum__forms_v_version_thank_you_form" ADD VALUE 'pladrr-eoi';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_form" ALTER COLUMN "form" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_form_form";
  CREATE TYPE "public"."enum_pages_blocks_form_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  ALTER TABLE "pages_blocks_form" ALTER COLUMN "form" SET DATA TYPE "public"."enum_pages_blocks_form_form" USING "form"::"public"."enum_pages_blocks_form_form";
  ALTER TABLE "_pages_v_blocks_form" ALTER COLUMN "form" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_form_form";
  CREATE TYPE "public"."enum__pages_v_blocks_form_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  ALTER TABLE "_pages_v_blocks_form" ALTER COLUMN "form" SET DATA TYPE "public"."enum__pages_v_blocks_form_form" USING "form"::"public"."enum__pages_v_blocks_form_form";
  ALTER TABLE "form_submissions" ALTER COLUMN "form" SET DATA TYPE text;
  DROP TYPE "public"."enum_form_submissions_form";
  CREATE TYPE "public"."enum_form_submissions_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact', 'session-registration');
  ALTER TABLE "form_submissions" ALTER COLUMN "form" SET DATA TYPE "public"."enum_form_submissions_form" USING "form"::"public"."enum_form_submissions_form";
  ALTER TABLE "forms_thank_you" ALTER COLUMN "form" SET DATA TYPE text;
  DROP TYPE "public"."enum_forms_thank_you_form";
  CREATE TYPE "public"."enum_forms_thank_you_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact', 'session-registration');
  ALTER TABLE "forms_thank_you" ALTER COLUMN "form" SET DATA TYPE "public"."enum_forms_thank_you_form" USING "form"::"public"."enum_forms_thank_you_form";
  ALTER TABLE "_forms_v_version_thank_you" ALTER COLUMN "form" SET DATA TYPE text;
  DROP TYPE "public"."enum__forms_v_version_thank_you_form";
  CREATE TYPE "public"."enum__forms_v_version_thank_you_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact', 'session-registration');
  ALTER TABLE "_forms_v_version_thank_you" ALTER COLUMN "form" SET DATA TYPE "public"."enum__forms_v_version_thank_you_form" USING "form"::"public"."enum__forms_v_version_thank_you_form";`)
}
