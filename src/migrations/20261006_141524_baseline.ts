import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_coming_soon_details_icon" AS ENUM('calendar', 'map-pin', 'globe', 'users', 'clock', 'mail');
  CREATE TYPE "public"."enum_coming_soon_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__coming_soon_v_version_details_icon" AS ENUM('calendar', 'map-pin', 'globe', 'users', 'clock', 'mail');
  CREATE TYPE "public"."enum__coming_soon_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "coming_soon_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_coming_soon_details_icon" DEFAULT 'calendar',
  	"title" varchar,
  	"subtitle" varchar
  );
  
  CREATE TABLE "coming_soon" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"brand_title" varchar,
  	"kicker" varchar,
  	"headline" varchar,
  	"lead" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"qr_label" varchar,
  	"qr_sublabel" varchar,
  	"footer_left" varchar,
  	"footer_right" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"_status" "enum_coming_soon_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "coming_soon_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_coming_soon_v_version_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__coming_soon_v_version_details_icon" DEFAULT 'calendar',
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_coming_soon_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_logo_id" integer,
  	"version_brand_title" varchar,
  	"version_kicker" varchar,
  	"version_headline" varchar,
  	"version_lead" varchar,
  	"version_body" varchar,
  	"version_cta_label" varchar,
  	"version_cta_url" varchar,
  	"version_qr_label" varchar,
  	"version_qr_sublabel" varchar,
  	"version_footer_left" varchar,
  	"version_footer_right" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version__status" "enum__coming_soon_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_coming_soon_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coming_soon_details" ADD CONSTRAINT "coming_soon_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."coming_soon"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coming_soon" ADD CONSTRAINT "coming_soon_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coming_soon" ADD CONSTRAINT "coming_soon_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "coming_soon_rels" ADD CONSTRAINT "coming_soon_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."coming_soon"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coming_soon_rels" ADD CONSTRAINT "coming_soon_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_coming_soon_v_version_details" ADD CONSTRAINT "_coming_soon_v_version_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_coming_soon_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_coming_soon_v" ADD CONSTRAINT "_coming_soon_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_coming_soon_v" ADD CONSTRAINT "_coming_soon_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_coming_soon_v_rels" ADD CONSTRAINT "_coming_soon_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_coming_soon_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_coming_soon_v_rels" ADD CONSTRAINT "_coming_soon_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "coming_soon_details_order_idx" ON "coming_soon_details" USING btree ("_order");
  CREATE INDEX "coming_soon_details_parent_id_idx" ON "coming_soon_details" USING btree ("_parent_id");
  CREATE INDEX "coming_soon_logo_idx" ON "coming_soon" USING btree ("logo_id");
  CREATE INDEX "coming_soon_meta_meta_image_idx" ON "coming_soon" USING btree ("meta_image_id");
  CREATE INDEX "coming_soon__status_idx" ON "coming_soon" USING btree ("_status");
  CREATE INDEX "coming_soon_rels_order_idx" ON "coming_soon_rels" USING btree ("order");
  CREATE INDEX "coming_soon_rels_parent_idx" ON "coming_soon_rels" USING btree ("parent_id");
  CREATE INDEX "coming_soon_rels_path_idx" ON "coming_soon_rels" USING btree ("path");
  CREATE INDEX "coming_soon_rels_media_id_idx" ON "coming_soon_rels" USING btree ("media_id");
  CREATE INDEX "_coming_soon_v_version_details_order_idx" ON "_coming_soon_v_version_details" USING btree ("_order");
  CREATE INDEX "_coming_soon_v_version_details_parent_id_idx" ON "_coming_soon_v_version_details" USING btree ("_parent_id");
  CREATE INDEX "_coming_soon_v_version_version_logo_idx" ON "_coming_soon_v" USING btree ("version_logo_id");
  CREATE INDEX "_coming_soon_v_version_meta_version_meta_image_idx" ON "_coming_soon_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_coming_soon_v_version_version__status_idx" ON "_coming_soon_v" USING btree ("version__status");
  CREATE INDEX "_coming_soon_v_created_at_idx" ON "_coming_soon_v" USING btree ("created_at");
  CREATE INDEX "_coming_soon_v_updated_at_idx" ON "_coming_soon_v" USING btree ("updated_at");
  CREATE INDEX "_coming_soon_v_latest_idx" ON "_coming_soon_v" USING btree ("latest");
  CREATE INDEX "_coming_soon_v_autosave_idx" ON "_coming_soon_v" USING btree ("autosave");
  CREATE INDEX "_coming_soon_v_rels_order_idx" ON "_coming_soon_v_rels" USING btree ("order");
  CREATE INDEX "_coming_soon_v_rels_parent_idx" ON "_coming_soon_v_rels" USING btree ("parent_id");
  CREATE INDEX "_coming_soon_v_rels_path_idx" ON "_coming_soon_v_rels" USING btree ("path");
  CREATE INDEX "_coming_soon_v_rels_media_id_idx" ON "_coming_soon_v_rels" USING btree ("media_id");`)
}

// One-way: undoing the baseline would drop every table, including payload_migrations itself.
export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('20261006_141524_baseline is one-way and cannot be rolled back')
}
