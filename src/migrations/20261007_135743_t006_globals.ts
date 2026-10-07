import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__header_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_donation_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__donation_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_anchor_day_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__anchor_day_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_dropdowns_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__dropdowns_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_forms_thank_you_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  CREATE TYPE "public"."enum_forms_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__forms_v_version_thank_you_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  CREATE TYPE "public"."enum__forms_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_cookie_consent_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__cookie_consent_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"brand_title" varchar,
  	"donate_label" varchar,
  	"_status" "enum_header_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_header_v_version_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_header_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_logo_id" integer,
  	"version_brand_title" varchar,
  	"version_donate_label" varchar,
  	"version__status" "enum__header_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"legal_text" varchar,
  	"_status" "enum_footer_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_footer_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_tagline" varchar,
  	"version_legal_text" varchar,
  	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "donation_settings_suggested_amounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"amount" numeric
  );
  
  CREATE TABLE "donation_settings_page_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "donation_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"currency" varchar DEFAULT 'usd',
  	"allow_custom_amount" boolean DEFAULT true,
  	"minimum_amount" numeric,
  	"page_kicker" varchar,
  	"page_heading" varchar,
  	"page_lead" varchar,
  	"page_reasons_heading" varchar,
  	"page_note" varchar,
  	"page_amount_legend" varchar,
  	"page_other_label" varchar,
  	"page_other_amount_label" varchar,
  	"page_other_amount_hint" varchar,
  	"page_submit_label" varchar,
  	"page_secure_payment_note" varchar,
  	"page_error_text" varchar,
  	"thank_you_kicker" varchar,
  	"thank_you_heading" varchar,
  	"thank_you_body" varchar,
  	"thank_you_link_label" varchar,
  	"unconfirmed_heading" varchar,
  	"unconfirmed_body" varchar,
  	"unconfirmed_link_label" varchar,
  	"banner_heading" varchar,
  	"banner_body" varchar,
  	"banner_label" varchar,
  	"_status" "enum_donation_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_donation_settings_v_version_suggested_amounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"amount" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_donation_settings_v_version_page_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_donation_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_currency" varchar DEFAULT 'usd',
  	"version_allow_custom_amount" boolean DEFAULT true,
  	"version_minimum_amount" numeric,
  	"version_page_kicker" varchar,
  	"version_page_heading" varchar,
  	"version_page_lead" varchar,
  	"version_page_reasons_heading" varchar,
  	"version_page_note" varchar,
  	"version_page_amount_legend" varchar,
  	"version_page_other_label" varchar,
  	"version_page_other_amount_label" varchar,
  	"version_page_other_amount_hint" varchar,
  	"version_page_submit_label" varchar,
  	"version_page_secure_payment_note" varchar,
  	"version_page_error_text" varchar,
  	"version_thank_you_kicker" varchar,
  	"version_thank_you_heading" varchar,
  	"version_thank_you_body" varchar,
  	"version_thank_you_link_label" varchar,
  	"version_unconfirmed_heading" varchar,
  	"version_unconfirmed_body" varchar,
  	"version_unconfirmed_link_label" varchar,
  	"version_banner_heading" varchar,
  	"version_banner_body" varchar,
  	"version_banner_label" varchar,
  	"version__status" "enum__donation_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "anchor_day" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"venue" varchar,
  	"moderator" varchar,
  	"mc" varchar,
  	"_status" "enum_anchor_day_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_anchor_day_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_date" timestamp(3) with time zone,
  	"version_venue" varchar,
  	"version_moderator" varchar,
  	"version_mc" varchar,
  	"version__status" "enum__anchor_day_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "dropdowns_territories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "dropdowns_audience_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "dropdowns_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "dropdowns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_dropdowns_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_dropdowns_v_version_territories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_dropdowns_v_version_audience_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_dropdowns_v_version_industries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_dropdowns_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__dropdowns_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "integrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"gtm_container_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "forms_thank_you" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form" "enum_forms_thank_you_form",
  	"heading" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_forms_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_forms_v_version_thank_you" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form" "enum__forms_v_version_thank_you_form",
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_forms_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__forms_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "cookie_consent" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"accept_label" varchar,
  	"reject_label" varchar,
  	"settings_label" varchar,
  	"_status" "enum_cookie_consent_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_cookie_consent_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_heading" varchar,
  	"version_body" varchar,
  	"version_accept_label" varchar,
  	"version_reject_label" varchar,
  	"version_settings_label" varchar,
  	"version__status" "enum__cookie_consent_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_header_v_version_nav_items" ADD CONSTRAINT "_header_v_version_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_header_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_header_v" ADD CONSTRAINT "_header_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_links" ADD CONSTRAINT "footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_links" ADD CONSTRAINT "_footer_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donation_settings_suggested_amounts" ADD CONSTRAINT "donation_settings_suggested_amounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donation_settings_page_reasons" ADD CONSTRAINT "donation_settings_page_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donation_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_donation_settings_v_version_suggested_amounts" ADD CONSTRAINT "_donation_settings_v_version_suggested_amounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_donation_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_donation_settings_v_version_page_reasons" ADD CONSTRAINT "_donation_settings_v_version_page_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_donation_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dropdowns_territories" ADD CONSTRAINT "dropdowns_territories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dropdowns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dropdowns_audience_types" ADD CONSTRAINT "dropdowns_audience_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dropdowns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dropdowns_industries" ADD CONSTRAINT "dropdowns_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dropdowns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dropdowns_v_version_territories" ADD CONSTRAINT "_dropdowns_v_version_territories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_dropdowns_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dropdowns_v_version_audience_types" ADD CONSTRAINT "_dropdowns_v_version_audience_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_dropdowns_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_dropdowns_v_version_industries" ADD CONSTRAINT "_dropdowns_v_version_industries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_dropdowns_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_thank_you" ADD CONSTRAINT "forms_thank_you_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_forms_v_version_thank_you" ADD CONSTRAINT "_forms_v_version_thank_you_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_forms_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX "header__status_idx" ON "header" USING btree ("_status");
  CREATE INDEX "_header_v_version_nav_items_order_idx" ON "_header_v_version_nav_items" USING btree ("_order");
  CREATE INDEX "_header_v_version_nav_items_parent_id_idx" ON "_header_v_version_nav_items" USING btree ("_parent_id");
  CREATE INDEX "_header_v_version_version_logo_idx" ON "_header_v" USING btree ("version_logo_id");
  CREATE INDEX "_header_v_version_version__status_idx" ON "_header_v" USING btree ("version__status");
  CREATE INDEX "_header_v_created_at_idx" ON "_header_v" USING btree ("created_at");
  CREATE INDEX "_header_v_updated_at_idx" ON "_header_v" USING btree ("updated_at");
  CREATE INDEX "_header_v_latest_idx" ON "_header_v" USING btree ("latest");
  CREATE INDEX "_header_v_autosave_idx" ON "_header_v" USING btree ("autosave");
  CREATE INDEX "footer_links_order_idx" ON "footer_links" USING btree ("_order");
  CREATE INDEX "footer_links_parent_id_idx" ON "footer_links" USING btree ("_parent_id");
  CREATE INDEX "footer__status_idx" ON "footer" USING btree ("_status");
  CREATE INDEX "_footer_v_version_links_order_idx" ON "_footer_v_version_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_links_parent_id_idx" ON "_footer_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  CREATE INDEX "_footer_v_autosave_idx" ON "_footer_v" USING btree ("autosave");
  CREATE INDEX "donation_settings_suggested_amounts_order_idx" ON "donation_settings_suggested_amounts" USING btree ("_order");
  CREATE INDEX "donation_settings_suggested_amounts_parent_id_idx" ON "donation_settings_suggested_amounts" USING btree ("_parent_id");
  CREATE INDEX "donation_settings_page_reasons_order_idx" ON "donation_settings_page_reasons" USING btree ("_order");
  CREATE INDEX "donation_settings_page_reasons_parent_id_idx" ON "donation_settings_page_reasons" USING btree ("_parent_id");
  CREATE INDEX "donation_settings__status_idx" ON "donation_settings" USING btree ("_status");
  CREATE INDEX "_donation_settings_v_version_suggested_amounts_order_idx" ON "_donation_settings_v_version_suggested_amounts" USING btree ("_order");
  CREATE INDEX "_donation_settings_v_version_suggested_amounts_parent_id_idx" ON "_donation_settings_v_version_suggested_amounts" USING btree ("_parent_id");
  CREATE INDEX "_donation_settings_v_version_page_reasons_order_idx" ON "_donation_settings_v_version_page_reasons" USING btree ("_order");
  CREATE INDEX "_donation_settings_v_version_page_reasons_parent_id_idx" ON "_donation_settings_v_version_page_reasons" USING btree ("_parent_id");
  CREATE INDEX "_donation_settings_v_version_version__status_idx" ON "_donation_settings_v" USING btree ("version__status");
  CREATE INDEX "_donation_settings_v_created_at_idx" ON "_donation_settings_v" USING btree ("created_at");
  CREATE INDEX "_donation_settings_v_updated_at_idx" ON "_donation_settings_v" USING btree ("updated_at");
  CREATE INDEX "_donation_settings_v_latest_idx" ON "_donation_settings_v" USING btree ("latest");
  CREATE INDEX "_donation_settings_v_autosave_idx" ON "_donation_settings_v" USING btree ("autosave");
  CREATE INDEX "anchor_day__status_idx" ON "anchor_day" USING btree ("_status");
  CREATE INDEX "_anchor_day_v_version_version__status_idx" ON "_anchor_day_v" USING btree ("version__status");
  CREATE INDEX "_anchor_day_v_created_at_idx" ON "_anchor_day_v" USING btree ("created_at");
  CREATE INDEX "_anchor_day_v_updated_at_idx" ON "_anchor_day_v" USING btree ("updated_at");
  CREATE INDEX "_anchor_day_v_latest_idx" ON "_anchor_day_v" USING btree ("latest");
  CREATE INDEX "_anchor_day_v_autosave_idx" ON "_anchor_day_v" USING btree ("autosave");
  CREATE INDEX "dropdowns_territories_order_idx" ON "dropdowns_territories" USING btree ("_order");
  CREATE INDEX "dropdowns_territories_parent_id_idx" ON "dropdowns_territories" USING btree ("_parent_id");
  CREATE INDEX "dropdowns_audience_types_order_idx" ON "dropdowns_audience_types" USING btree ("_order");
  CREATE INDEX "dropdowns_audience_types_parent_id_idx" ON "dropdowns_audience_types" USING btree ("_parent_id");
  CREATE INDEX "dropdowns_industries_order_idx" ON "dropdowns_industries" USING btree ("_order");
  CREATE INDEX "dropdowns_industries_parent_id_idx" ON "dropdowns_industries" USING btree ("_parent_id");
  CREATE INDEX "dropdowns__status_idx" ON "dropdowns" USING btree ("_status");
  CREATE INDEX "_dropdowns_v_version_territories_order_idx" ON "_dropdowns_v_version_territories" USING btree ("_order");
  CREATE INDEX "_dropdowns_v_version_territories_parent_id_idx" ON "_dropdowns_v_version_territories" USING btree ("_parent_id");
  CREATE INDEX "_dropdowns_v_version_audience_types_order_idx" ON "_dropdowns_v_version_audience_types" USING btree ("_order");
  CREATE INDEX "_dropdowns_v_version_audience_types_parent_id_idx" ON "_dropdowns_v_version_audience_types" USING btree ("_parent_id");
  CREATE INDEX "_dropdowns_v_version_industries_order_idx" ON "_dropdowns_v_version_industries" USING btree ("_order");
  CREATE INDEX "_dropdowns_v_version_industries_parent_id_idx" ON "_dropdowns_v_version_industries" USING btree ("_parent_id");
  CREATE INDEX "_dropdowns_v_version_version__status_idx" ON "_dropdowns_v" USING btree ("version__status");
  CREATE INDEX "_dropdowns_v_created_at_idx" ON "_dropdowns_v" USING btree ("created_at");
  CREATE INDEX "_dropdowns_v_updated_at_idx" ON "_dropdowns_v" USING btree ("updated_at");
  CREATE INDEX "_dropdowns_v_latest_idx" ON "_dropdowns_v" USING btree ("latest");
  CREATE INDEX "_dropdowns_v_autosave_idx" ON "_dropdowns_v" USING btree ("autosave");
  CREATE INDEX "forms_thank_you_order_idx" ON "forms_thank_you" USING btree ("_order");
  CREATE INDEX "forms_thank_you_parent_id_idx" ON "forms_thank_you" USING btree ("_parent_id");
  CREATE INDEX "forms__status_idx" ON "forms" USING btree ("_status");
  CREATE INDEX "_forms_v_version_thank_you_order_idx" ON "_forms_v_version_thank_you" USING btree ("_order");
  CREATE INDEX "_forms_v_version_thank_you_parent_id_idx" ON "_forms_v_version_thank_you" USING btree ("_parent_id");
  CREATE INDEX "_forms_v_version_version__status_idx" ON "_forms_v" USING btree ("version__status");
  CREATE INDEX "_forms_v_created_at_idx" ON "_forms_v" USING btree ("created_at");
  CREATE INDEX "_forms_v_updated_at_idx" ON "_forms_v" USING btree ("updated_at");
  CREATE INDEX "_forms_v_latest_idx" ON "_forms_v" USING btree ("latest");
  CREATE INDEX "_forms_v_autosave_idx" ON "_forms_v" USING btree ("autosave");
  CREATE INDEX "cookie_consent__status_idx" ON "cookie_consent" USING btree ("_status");
  CREATE INDEX "_cookie_consent_v_version_version__status_idx" ON "_cookie_consent_v" USING btree ("version__status");
  CREATE INDEX "_cookie_consent_v_created_at_idx" ON "_cookie_consent_v" USING btree ("created_at");
  CREATE INDEX "_cookie_consent_v_updated_at_idx" ON "_cookie_consent_v" USING btree ("updated_at");
  CREATE INDEX "_cookie_consent_v_latest_idx" ON "_cookie_consent_v" USING btree ("latest");
  CREATE INDEX "_cookie_consent_v_autosave_idx" ON "_cookie_consent_v" USING btree ("autosave");`)

  // Local and self-hosted Postgres lack Supabase's automatic RLS trigger (SPEC §11.2).
  await db.execute(sql`
    DO $$
    DECLARE
      t record;
    BEGIN
      FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
      END LOOP;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "_header_v_version_nav_items" CASCADE;
  DROP TABLE "_header_v" CASCADE;
  DROP TABLE "footer_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "_footer_v_version_links" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "donation_settings_suggested_amounts" CASCADE;
  DROP TABLE "donation_settings_page_reasons" CASCADE;
  DROP TABLE "donation_settings" CASCADE;
  DROP TABLE "_donation_settings_v_version_suggested_amounts" CASCADE;
  DROP TABLE "_donation_settings_v_version_page_reasons" CASCADE;
  DROP TABLE "_donation_settings_v" CASCADE;
  DROP TABLE "anchor_day" CASCADE;
  DROP TABLE "_anchor_day_v" CASCADE;
  DROP TABLE "dropdowns_territories" CASCADE;
  DROP TABLE "dropdowns_audience_types" CASCADE;
  DROP TABLE "dropdowns_industries" CASCADE;
  DROP TABLE "dropdowns" CASCADE;
  DROP TABLE "_dropdowns_v_version_territories" CASCADE;
  DROP TABLE "_dropdowns_v_version_audience_types" CASCADE;
  DROP TABLE "_dropdowns_v_version_industries" CASCADE;
  DROP TABLE "_dropdowns_v" CASCADE;
  DROP TABLE "integrations" CASCADE;
  DROP TABLE "forms_thank_you" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "_forms_v_version_thank_you" CASCADE;
  DROP TABLE "_forms_v" CASCADE;
  DROP TABLE "cookie_consent" CASCADE;
  DROP TABLE "_cookie_consent_v" CASCADE;
  DROP TYPE "public"."enum_header_status";
  DROP TYPE "public"."enum__header_v_version_status";
  DROP TYPE "public"."enum_footer_status";
  DROP TYPE "public"."enum__footer_v_version_status";
  DROP TYPE "public"."enum_donation_settings_status";
  DROP TYPE "public"."enum__donation_settings_v_version_status";
  DROP TYPE "public"."enum_anchor_day_status";
  DROP TYPE "public"."enum__anchor_day_v_version_status";
  DROP TYPE "public"."enum_dropdowns_status";
  DROP TYPE "public"."enum__dropdowns_v_version_status";
  DROP TYPE "public"."enum_forms_thank_you_form";
  DROP TYPE "public"."enum_forms_status";
  DROP TYPE "public"."enum__forms_v_version_thank_you_form";
  DROP TYPE "public"."enum__forms_v_version_status";
  DROP TYPE "public"."enum_cookie_consent_status";
  DROP TYPE "public"."enum__cookie_consent_v_version_status";`)
}
