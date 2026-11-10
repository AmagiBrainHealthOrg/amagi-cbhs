import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "countries_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "_countries_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "countries_gallery" ADD CONSTRAINT "countries_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "countries_gallery" ADD CONSTRAINT "countries_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_countries_v_version_gallery" ADD CONSTRAINT "_countries_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_countries_v_version_gallery" ADD CONSTRAINT "_countries_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_countries_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "countries_gallery_order_idx" ON "countries_gallery" USING btree ("_order");
  CREATE INDEX "countries_gallery_parent_id_idx" ON "countries_gallery" USING btree ("_parent_id");
  CREATE INDEX "countries_gallery_image_idx" ON "countries_gallery" USING btree ("image_id");
  CREATE INDEX "_countries_v_version_gallery_order_idx" ON "_countries_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_countries_v_version_gallery_parent_id_idx" ON "_countries_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_countries_v_version_gallery_image_idx" ON "_countries_v_version_gallery" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "countries_gallery" CASCADE;
  DROP TABLE "_countries_v_version_gallery" CASCADE;`)
}
