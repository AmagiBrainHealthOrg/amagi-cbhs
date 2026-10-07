import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "donation_settings" ADD COLUMN "checkout_item_name" varchar;
  ALTER TABLE "donation_settings" ADD COLUMN "checkout_item_description" varchar;
  ALTER TABLE "_donation_settings_v" ADD COLUMN "version_checkout_item_name" varchar;
  ALTER TABLE "_donation_settings_v" ADD COLUMN "version_checkout_item_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "donation_settings" DROP COLUMN "checkout_item_name";
  ALTER TABLE "donation_settings" DROP COLUMN "checkout_item_description";
  ALTER TABLE "_donation_settings_v" DROP COLUMN "version_checkout_item_name";
  ALTER TABLE "_donation_settings_v" DROP COLUMN "version_checkout_item_description";`)
}
