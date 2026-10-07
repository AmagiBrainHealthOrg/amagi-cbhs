import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_style" AS ENUM('map', 'photo', 'plain');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_layout" AS ENUM('split', 'prose');
  CREATE TYPE "public"."enum_pages_blocks_host_map_countries_label_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_host_map_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_summit_week_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_roadmap_steps_status" AS ENUM('done', 'now', 'next');
  CREATE TYPE "public"."enum_pages_blocks_roadmap_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_flow_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_items_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_style" AS ENUM('tiles', 'badges');
  CREATE TYPE "public"."enum_pages_blocks_action_areas_areas_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  CREATE TYPE "public"."enum_pages_blocks_action_areas_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_supporter_levels_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_logo_grid_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_logo_grid_source" AS ENUM('supporters', 'partners');
  CREATE TYPE "public"."enum_pages_blocks_faq_list_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_news_teaser_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_form_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_blocks_form_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  CREATE TYPE "public"."enum_pages_blocks_anchor_day_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_style" AS ENUM('map', 'photo', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_layout" AS ENUM('split', 'prose');
  CREATE TYPE "public"."enum__pages_v_blocks_host_map_countries_label_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_host_map_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_summit_week_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_roadmap_steps_status" AS ENUM('done', 'now', 'next');
  CREATE TYPE "public"."enum__pages_v_blocks_roadmap_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_flow_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_items_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_style" AS ENUM('tiles', 'badges');
  CREATE TYPE "public"."enum__pages_v_blocks_action_areas_areas_icon" AS ENUM('megaphone', 'shield', 'stethoscope', 'graduation', 'landmark', 'users', 'video', 'hand-heart', 'file-text', 'scale', 'badge-check', 'lock');
  CREATE TYPE "public"."enum__pages_v_blocks_action_areas_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_supporter_levels_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_grid_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_grid_source" AS ENUM('supporters', 'partners');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_list_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_news_teaser_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_form_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_blocks_form_form" AS ENUM('register-interest', 'cta-consultation', 'partner', 'relay', 'contact');
  CREATE TYPE "public"."enum__pages_v_blocks_anchor_day_background" AS ENUM('white', 'pale', 'blue');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_type" AS ENUM('news', 'partner-announcement');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_type" AS ENUM('news', 'partner-announcement');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_supporters_level" AS ENUM('founding-regional', 'regional', 'access-participation', 'community');
  CREATE TYPE "public"."enum_supporters_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__supporters_v_version_level" AS ENUM('founding-regional', 'regional', 'access-participation', 'community');
  CREATE TYPE "public"."enum__supporters_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faqs_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pages_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_hero_style" DEFAULT 'photo',
  	"kicker" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"show_donate_button" boolean DEFAULT true,
  	"secondary_link_label" varchar,
  	"secondary_link_href" varchar,
  	"countdown_target" timestamp(3) with time zone,
  	"countdown_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_rich_text_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"content" jsonb,
  	"layout" "enum_pages_blocks_rich_text_layout" DEFAULT 'split',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"source" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_host_map_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"city" varchar,
  	"x" numeric,
  	"y" numeric,
  	"label_side" "enum_pages_blocks_host_map_countries_label_side" DEFAULT 'left',
  	"anchor" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_host_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_host_map_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"online_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_summit_week_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"date" varchar,
  	"label" varchar,
  	"body" varchar,
  	"anchor" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_summit_week" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_summit_week_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_roadmap_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"when" varchar,
  	"title" varchar,
  	"status" "enum_pages_blocks_roadmap_steps_status" DEFAULT 'next',
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_roadmap" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_roadmap_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"numbered" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_flow_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_flow_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_card_grid_items_icon",
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_card_grid_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"style" "enum_pages_blocks_card_grid_style" DEFAULT 'tiles',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_action_areas_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_action_areas_areas_icon",
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_action_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_action_areas_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"centre_label" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_supporter_levels_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_supporter_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_supporter_levels_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_logo_grid_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"source" "enum_pages_blocks_logo_grid_source" DEFAULT 'supporters',
  	"empty_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_faq_list_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"category" varchar,
  	"show_categories" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_news_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_news_teaser_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"limit" numeric DEFAULT 3,
  	"link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_donate_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_form_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"form" "enum_pages_blocks_form_form",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_anchor_day" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum_pages_blocks_anchor_day_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_hero_style" DEFAULT 'photo',
  	"kicker" varchar,
  	"heading" varchar,
  	"lead" varchar,
  	"show_donate_button" boolean DEFAULT true,
  	"secondary_link_label" varchar,
  	"secondary_link_href" varchar,
  	"countdown_target" timestamp(3) with time zone,
  	"countdown_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_rich_text_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"content" jsonb,
  	"layout" "enum__pages_v_blocks_rich_text_layout" DEFAULT 'split',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"source" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_host_map_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"city" varchar,
  	"x" numeric,
  	"y" numeric,
  	"label_side" "enum__pages_v_blocks_host_map_countries_label_side" DEFAULT 'left',
  	"anchor" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_host_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_host_map_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"online_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_summit_week_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar,
  	"date" varchar,
  	"label" varchar,
  	"body" varchar,
  	"anchor" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_summit_week" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_summit_week_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_roadmap_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"when" varchar,
  	"title" varchar,
  	"status" "enum__pages_v_blocks_roadmap_steps_status" DEFAULT 'next',
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_roadmap" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_roadmap_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"numbered" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_flow_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_flow" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_flow_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_card_grid_items_icon",
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_card_grid_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"style" "enum__pages_v_blocks_card_grid_style" DEFAULT 'tiles',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_action_areas_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_action_areas_areas_icon",
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_action_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_action_areas_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"centre_label" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_supporter_levels_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_supporter_levels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_supporter_levels_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_logo_grid_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"source" "enum__pages_v_blocks_logo_grid_source" DEFAULT 'supporters',
  	"empty_text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_faq_list_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"category" varchar,
  	"show_categories" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_news_teaser" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_news_teaser_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"limit" numeric DEFAULT 3,
  	"link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_donate_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_form_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"form" "enum__pages_v_blocks_form_form",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_anchor_day" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"background" "enum__pages_v_blocks_anchor_day_background" DEFAULT 'white',
  	"anchor_id" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"published_date" timestamp(3) with time zone,
  	"type" "enum_news_type" DEFAULT 'news',
  	"partner_id" integer,
  	"summary" varchar,
  	"image_id" integer,
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_published_date" timestamp(3) with time zone,
  	"version_type" "enum__news_v_version_type" DEFAULT 'news',
  	"version_partner_id" integer,
  	"version_summary" varchar,
  	"version_image_id" integer,
  	"version_body" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"description" varchar,
  	"website" varchar,
  	"permission_confirmed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_partners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_description" varchar,
  	"version_website" varchar,
  	"version_permission_confirmed" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "supporters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"level" "enum_supporters_level",
  	"permission_confirmed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_supporters_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_supporters_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_logo_id" integer,
  	"version_level" "enum__supporters_v_version_level",
  	"version_permission_confirmed" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__supporters_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"category" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faqs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_faqs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_question" varchar,
  	"version_answer" varchar,
  	"version_category" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faqs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "partners_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "supporters_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "pages_blocks_hero_stats" ADD CONSTRAINT "pages_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement" ADD CONSTRAINT "pages_blocks_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_host_map_countries" ADD CONSTRAINT "pages_blocks_host_map_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_host_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_host_map" ADD CONSTRAINT "pages_blocks_host_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_summit_week_days" ADD CONSTRAINT "pages_blocks_summit_week_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_summit_week"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_summit_week" ADD CONSTRAINT "pages_blocks_summit_week_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_roadmap_steps" ADD CONSTRAINT "pages_blocks_roadmap_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_roadmap"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_roadmap" ADD CONSTRAINT "pages_blocks_roadmap_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_flow_steps" ADD CONSTRAINT "pages_blocks_flow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_flow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_flow" ADD CONSTRAINT "pages_blocks_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_items" ADD CONSTRAINT "pages_blocks_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_action_areas_areas" ADD CONSTRAINT "pages_blocks_action_areas_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_action_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_action_areas" ADD CONSTRAINT "pages_blocks_action_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_supporter_levels_levels" ADD CONSTRAINT "pages_blocks_supporter_levels_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_supporter_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_supporter_levels" ADD CONSTRAINT "pages_blocks_supporter_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_grid" ADD CONSTRAINT "pages_blocks_logo_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_list" ADD CONSTRAINT "pages_blocks_faq_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_news_teaser" ADD CONSTRAINT "pages_blocks_news_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_donate_banner" ADD CONSTRAINT "pages_blocks_donate_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form" ADD CONSTRAINT "pages_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_anchor_day" ADD CONSTRAINT "pages_blocks_anchor_day_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_stats" ADD CONSTRAINT "_pages_v_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statement" ADD CONSTRAINT "_pages_v_blocks_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_host_map_countries" ADD CONSTRAINT "_pages_v_blocks_host_map_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_host_map"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_host_map" ADD CONSTRAINT "_pages_v_blocks_host_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_summit_week_days" ADD CONSTRAINT "_pages_v_blocks_summit_week_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_summit_week"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_summit_week" ADD CONSTRAINT "_pages_v_blocks_summit_week_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_roadmap_steps" ADD CONSTRAINT "_pages_v_blocks_roadmap_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_roadmap"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_roadmap" ADD CONSTRAINT "_pages_v_blocks_roadmap_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_flow_steps" ADD CONSTRAINT "_pages_v_blocks_flow_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_flow"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_flow" ADD CONSTRAINT "_pages_v_blocks_flow_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_items" ADD CONSTRAINT "_pages_v_blocks_card_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_action_areas_areas" ADD CONSTRAINT "_pages_v_blocks_action_areas_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_action_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_action_areas" ADD CONSTRAINT "_pages_v_blocks_action_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_supporter_levels_levels" ADD CONSTRAINT "_pages_v_blocks_supporter_levels_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_supporter_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_supporter_levels" ADD CONSTRAINT "_pages_v_blocks_supporter_levels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_grid" ADD CONSTRAINT "_pages_v_blocks_logo_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_list" ADD CONSTRAINT "_pages_v_blocks_faq_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_news_teaser" ADD CONSTRAINT "_pages_v_blocks_news_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_donate_banner" ADD CONSTRAINT "_pages_v_blocks_donate_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form" ADD CONSTRAINT "_pages_v_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_anchor_day" ADD CONSTRAINT "_pages_v_blocks_anchor_day_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_partner_id_partners_id_fk" FOREIGN KEY ("version_partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "supporters" ADD CONSTRAINT "supporters_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_supporters_v" ADD CONSTRAINT "_supporters_v_parent_id_supporters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."supporters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_supporters_v" ADD CONSTRAINT "_supporters_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faqs_v" ADD CONSTRAINT "_faqs_v_parent_id_faqs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_stats_order_idx" ON "pages_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_stats_parent_id_idx" ON "pages_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_statement_order_idx" ON "pages_blocks_statement" USING btree ("_order");
  CREATE INDEX "pages_blocks_statement_parent_id_idx" ON "pages_blocks_statement" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statement_path_idx" ON "pages_blocks_statement" USING btree ("_path");
  CREATE INDEX "pages_blocks_host_map_countries_order_idx" ON "pages_blocks_host_map_countries" USING btree ("_order");
  CREATE INDEX "pages_blocks_host_map_countries_parent_id_idx" ON "pages_blocks_host_map_countries" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_host_map_order_idx" ON "pages_blocks_host_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_host_map_parent_id_idx" ON "pages_blocks_host_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_host_map_path_idx" ON "pages_blocks_host_map" USING btree ("_path");
  CREATE INDEX "pages_blocks_summit_week_days_order_idx" ON "pages_blocks_summit_week_days" USING btree ("_order");
  CREATE INDEX "pages_blocks_summit_week_days_parent_id_idx" ON "pages_blocks_summit_week_days" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_summit_week_order_idx" ON "pages_blocks_summit_week" USING btree ("_order");
  CREATE INDEX "pages_blocks_summit_week_parent_id_idx" ON "pages_blocks_summit_week" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_summit_week_path_idx" ON "pages_blocks_summit_week" USING btree ("_path");
  CREATE INDEX "pages_blocks_roadmap_steps_order_idx" ON "pages_blocks_roadmap_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_roadmap_steps_parent_id_idx" ON "pages_blocks_roadmap_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_roadmap_order_idx" ON "pages_blocks_roadmap" USING btree ("_order");
  CREATE INDEX "pages_blocks_roadmap_parent_id_idx" ON "pages_blocks_roadmap" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_roadmap_path_idx" ON "pages_blocks_roadmap" USING btree ("_path");
  CREATE INDEX "pages_blocks_flow_steps_order_idx" ON "pages_blocks_flow_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_flow_steps_parent_id_idx" ON "pages_blocks_flow_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_flow_order_idx" ON "pages_blocks_flow" USING btree ("_order");
  CREATE INDEX "pages_blocks_flow_parent_id_idx" ON "pages_blocks_flow" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_flow_path_idx" ON "pages_blocks_flow" USING btree ("_path");
  CREATE INDEX "pages_blocks_card_grid_items_order_idx" ON "pages_blocks_card_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_items_parent_id_idx" ON "pages_blocks_card_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_order_idx" ON "pages_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_parent_id_idx" ON "pages_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_path_idx" ON "pages_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_action_areas_areas_order_idx" ON "pages_blocks_action_areas_areas" USING btree ("_order");
  CREATE INDEX "pages_blocks_action_areas_areas_parent_id_idx" ON "pages_blocks_action_areas_areas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_action_areas_order_idx" ON "pages_blocks_action_areas" USING btree ("_order");
  CREATE INDEX "pages_blocks_action_areas_parent_id_idx" ON "pages_blocks_action_areas" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_action_areas_path_idx" ON "pages_blocks_action_areas" USING btree ("_path");
  CREATE INDEX "pages_blocks_supporter_levels_levels_order_idx" ON "pages_blocks_supporter_levels_levels" USING btree ("_order");
  CREATE INDEX "pages_blocks_supporter_levels_levels_parent_id_idx" ON "pages_blocks_supporter_levels_levels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_supporter_levels_order_idx" ON "pages_blocks_supporter_levels" USING btree ("_order");
  CREATE INDEX "pages_blocks_supporter_levels_parent_id_idx" ON "pages_blocks_supporter_levels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_supporter_levels_path_idx" ON "pages_blocks_supporter_levels" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_grid_order_idx" ON "pages_blocks_logo_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_grid_parent_id_idx" ON "pages_blocks_logo_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_grid_path_idx" ON "pages_blocks_logo_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_list_order_idx" ON "pages_blocks_faq_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_list_parent_id_idx" ON "pages_blocks_faq_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_list_path_idx" ON "pages_blocks_faq_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_news_teaser_order_idx" ON "pages_blocks_news_teaser" USING btree ("_order");
  CREATE INDEX "pages_blocks_news_teaser_parent_id_idx" ON "pages_blocks_news_teaser" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_news_teaser_path_idx" ON "pages_blocks_news_teaser" USING btree ("_path");
  CREATE INDEX "pages_blocks_donate_banner_order_idx" ON "pages_blocks_donate_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_donate_banner_parent_id_idx" ON "pages_blocks_donate_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_donate_banner_path_idx" ON "pages_blocks_donate_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_order_idx" ON "pages_blocks_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_parent_id_idx" ON "pages_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_path_idx" ON "pages_blocks_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_anchor_day_order_idx" ON "pages_blocks_anchor_day" USING btree ("_order");
  CREATE INDEX "pages_blocks_anchor_day_parent_id_idx" ON "pages_blocks_anchor_day" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_anchor_day_path_idx" ON "pages_blocks_anchor_day" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_hero_stats_order_idx" ON "_pages_v_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_stats_parent_id_idx" ON "_pages_v_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_statement_order_idx" ON "_pages_v_blocks_statement" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statement_parent_id_idx" ON "_pages_v_blocks_statement" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statement_path_idx" ON "_pages_v_blocks_statement" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_host_map_countries_order_idx" ON "_pages_v_blocks_host_map_countries" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_host_map_countries_parent_id_idx" ON "_pages_v_blocks_host_map_countries" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_host_map_order_idx" ON "_pages_v_blocks_host_map" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_host_map_parent_id_idx" ON "_pages_v_blocks_host_map" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_host_map_path_idx" ON "_pages_v_blocks_host_map" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_summit_week_days_order_idx" ON "_pages_v_blocks_summit_week_days" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_summit_week_days_parent_id_idx" ON "_pages_v_blocks_summit_week_days" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_summit_week_order_idx" ON "_pages_v_blocks_summit_week" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_summit_week_parent_id_idx" ON "_pages_v_blocks_summit_week" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_summit_week_path_idx" ON "_pages_v_blocks_summit_week" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_roadmap_steps_order_idx" ON "_pages_v_blocks_roadmap_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_roadmap_steps_parent_id_idx" ON "_pages_v_blocks_roadmap_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_roadmap_order_idx" ON "_pages_v_blocks_roadmap" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_roadmap_parent_id_idx" ON "_pages_v_blocks_roadmap" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_roadmap_path_idx" ON "_pages_v_blocks_roadmap" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_flow_steps_order_idx" ON "_pages_v_blocks_flow_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_flow_steps_parent_id_idx" ON "_pages_v_blocks_flow_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_flow_order_idx" ON "_pages_v_blocks_flow" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_flow_parent_id_idx" ON "_pages_v_blocks_flow" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_flow_path_idx" ON "_pages_v_blocks_flow" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_grid_items_order_idx" ON "_pages_v_blocks_card_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_items_parent_id_idx" ON "_pages_v_blocks_card_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_order_idx" ON "_pages_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_parent_id_idx" ON "_pages_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_path_idx" ON "_pages_v_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_action_areas_areas_order_idx" ON "_pages_v_blocks_action_areas_areas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_action_areas_areas_parent_id_idx" ON "_pages_v_blocks_action_areas_areas" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_action_areas_order_idx" ON "_pages_v_blocks_action_areas" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_action_areas_parent_id_idx" ON "_pages_v_blocks_action_areas" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_action_areas_path_idx" ON "_pages_v_blocks_action_areas" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_supporter_levels_levels_order_idx" ON "_pages_v_blocks_supporter_levels_levels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_supporter_levels_levels_parent_id_idx" ON "_pages_v_blocks_supporter_levels_levels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_supporter_levels_order_idx" ON "_pages_v_blocks_supporter_levels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_supporter_levels_parent_id_idx" ON "_pages_v_blocks_supporter_levels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_supporter_levels_path_idx" ON "_pages_v_blocks_supporter_levels" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_grid_order_idx" ON "_pages_v_blocks_logo_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_grid_parent_id_idx" ON "_pages_v_blocks_logo_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_grid_path_idx" ON "_pages_v_blocks_logo_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_list_order_idx" ON "_pages_v_blocks_faq_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_list_parent_id_idx" ON "_pages_v_blocks_faq_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_list_path_idx" ON "_pages_v_blocks_faq_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_news_teaser_order_idx" ON "_pages_v_blocks_news_teaser" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_news_teaser_parent_id_idx" ON "_pages_v_blocks_news_teaser" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_news_teaser_path_idx" ON "_pages_v_blocks_news_teaser" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_donate_banner_order_idx" ON "_pages_v_blocks_donate_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_donate_banner_parent_id_idx" ON "_pages_v_blocks_donate_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_donate_banner_path_idx" ON "_pages_v_blocks_donate_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_order_idx" ON "_pages_v_blocks_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_parent_id_idx" ON "_pages_v_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_path_idx" ON "_pages_v_blocks_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_anchor_day_order_idx" ON "_pages_v_blocks_anchor_day" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_anchor_day_parent_id_idx" ON "_pages_v_blocks_anchor_day" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_anchor_day_path_idx" ON "_pages_v_blocks_anchor_day" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_published_date_idx" ON "news" USING btree ("published_date");
  CREATE INDEX "news_partner_idx" ON "news" USING btree ("partner_id");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_published_date_idx" ON "_news_v" USING btree ("version_published_date");
  CREATE INDEX "_news_v_version_version_partner_idx" ON "_news_v" USING btree ("version_partner_id");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "partners__status_idx" ON "partners" USING btree ("_status");
  CREATE INDEX "_partners_v_parent_idx" ON "_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_latest_idx" ON "_partners_v" USING btree ("latest");
  CREATE INDEX "_partners_v_autosave_idx" ON "_partners_v" USING btree ("autosave");
  CREATE INDEX "supporters_logo_idx" ON "supporters" USING btree ("logo_id");
  CREATE INDEX "supporters_updated_at_idx" ON "supporters" USING btree ("updated_at");
  CREATE INDEX "supporters_created_at_idx" ON "supporters" USING btree ("created_at");
  CREATE INDEX "supporters__status_idx" ON "supporters" USING btree ("_status");
  CREATE INDEX "_supporters_v_parent_idx" ON "_supporters_v" USING btree ("parent_id");
  CREATE INDEX "_supporters_v_version_version_logo_idx" ON "_supporters_v" USING btree ("version_logo_id");
  CREATE INDEX "_supporters_v_version_version_updated_at_idx" ON "_supporters_v" USING btree ("version_updated_at");
  CREATE INDEX "_supporters_v_version_version_created_at_idx" ON "_supporters_v" USING btree ("version_created_at");
  CREATE INDEX "_supporters_v_version_version__status_idx" ON "_supporters_v" USING btree ("version__status");
  CREATE INDEX "_supporters_v_created_at_idx" ON "_supporters_v" USING btree ("created_at");
  CREATE INDEX "_supporters_v_updated_at_idx" ON "_supporters_v" USING btree ("updated_at");
  CREATE INDEX "_supporters_v_latest_idx" ON "_supporters_v" USING btree ("latest");
  CREATE INDEX "_supporters_v_autosave_idx" ON "_supporters_v" USING btree ("autosave");
  CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs__status_idx" ON "faqs" USING btree ("_status");
  CREATE INDEX "_faqs_v_parent_idx" ON "_faqs_v" USING btree ("parent_id");
  CREATE INDEX "_faqs_v_version_version_category_idx" ON "_faqs_v" USING btree ("version_category");
  CREATE INDEX "_faqs_v_version_version_updated_at_idx" ON "_faqs_v" USING btree ("version_updated_at");
  CREATE INDEX "_faqs_v_version_version_created_at_idx" ON "_faqs_v" USING btree ("version_created_at");
  CREATE INDEX "_faqs_v_version_version__status_idx" ON "_faqs_v" USING btree ("version__status");
  CREATE INDEX "_faqs_v_created_at_idx" ON "_faqs_v" USING btree ("created_at");
  CREATE INDEX "_faqs_v_updated_at_idx" ON "_faqs_v" USING btree ("updated_at");
  CREATE INDEX "_faqs_v_latest_idx" ON "_faqs_v" USING btree ("latest");
  CREATE INDEX "_faqs_v_autosave_idx" ON "_faqs_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_supporters_fk" FOREIGN KEY ("supporters_id") REFERENCES "public"."supporters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_supporters_id_idx" ON "payload_locked_documents_rels" USING btree ("supporters_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");`)

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
   ALTER TABLE "pages_blocks_hero_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_statement" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_host_map_countries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_host_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_summit_week_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_summit_week" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_roadmap_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_roadmap" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_flow_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_flow" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_card_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_action_areas_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_action_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_supporter_levels_levels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_supporter_levels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_news_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_donate_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_anchor_day" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_statement" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_host_map_countries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_host_map" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_summit_week_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_summit_week" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_roadmap_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_roadmap" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_flow_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_flow" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_card_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_card_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_action_areas_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_action_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_supporter_levels_levels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_supporter_levels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_faq_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_news_teaser" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_donate_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_anchor_day" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_partners_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "supporters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_supporters_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_faqs_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_stats" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_statement" CASCADE;
  DROP TABLE "pages_blocks_host_map_countries" CASCADE;
  DROP TABLE "pages_blocks_host_map" CASCADE;
  DROP TABLE "pages_blocks_summit_week_days" CASCADE;
  DROP TABLE "pages_blocks_summit_week" CASCADE;
  DROP TABLE "pages_blocks_roadmap_steps" CASCADE;
  DROP TABLE "pages_blocks_roadmap" CASCADE;
  DROP TABLE "pages_blocks_flow_steps" CASCADE;
  DROP TABLE "pages_blocks_flow" CASCADE;
  DROP TABLE "pages_blocks_card_grid_items" CASCADE;
  DROP TABLE "pages_blocks_card_grid" CASCADE;
  DROP TABLE "pages_blocks_action_areas_areas" CASCADE;
  DROP TABLE "pages_blocks_action_areas" CASCADE;
  DROP TABLE "pages_blocks_supporter_levels_levels" CASCADE;
  DROP TABLE "pages_blocks_supporter_levels" CASCADE;
  DROP TABLE "pages_blocks_logo_grid" CASCADE;
  DROP TABLE "pages_blocks_faq_list" CASCADE;
  DROP TABLE "pages_blocks_news_teaser" CASCADE;
  DROP TABLE "pages_blocks_donate_banner" CASCADE;
  DROP TABLE "pages_blocks_form" CASCADE;
  DROP TABLE "pages_blocks_anchor_day" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_statement" CASCADE;
  DROP TABLE "_pages_v_blocks_host_map_countries" CASCADE;
  DROP TABLE "_pages_v_blocks_host_map" CASCADE;
  DROP TABLE "_pages_v_blocks_summit_week_days" CASCADE;
  DROP TABLE "_pages_v_blocks_summit_week" CASCADE;
  DROP TABLE "_pages_v_blocks_roadmap_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_roadmap" CASCADE;
  DROP TABLE "_pages_v_blocks_flow_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_flow" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_action_areas_areas" CASCADE;
  DROP TABLE "_pages_v_blocks_action_areas" CASCADE;
  DROP TABLE "_pages_v_blocks_supporter_levels_levels" CASCADE;
  DROP TABLE "_pages_v_blocks_supporter_levels" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_list" CASCADE;
  DROP TABLE "_pages_v_blocks_news_teaser" CASCADE;
  DROP TABLE "_pages_v_blocks_donate_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_form" CASCADE;
  DROP TABLE "_pages_v_blocks_anchor_day" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "_partners_v" CASCADE;
  DROP TABLE "supporters" CASCADE;
  DROP TABLE "_supporters_v" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "_faqs_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_supporters_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faqs_fk";
  
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_news_id_idx";
  DROP INDEX "payload_locked_documents_rels_partners_id_idx";
  DROP INDEX "payload_locked_documents_rels_supporters_id_idx";
  DROP INDEX "payload_locked_documents_rels_faqs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "partners_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "supporters_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faqs_id";
  DROP TYPE "public"."enum_pages_blocks_hero_style";
  DROP TYPE "public"."enum_pages_blocks_rich_text_background";
  DROP TYPE "public"."enum_pages_blocks_rich_text_layout";
  DROP TYPE "public"."enum_pages_blocks_host_map_countries_label_side";
  DROP TYPE "public"."enum_pages_blocks_host_map_background";
  DROP TYPE "public"."enum_pages_blocks_summit_week_background";
  DROP TYPE "public"."enum_pages_blocks_roadmap_steps_status";
  DROP TYPE "public"."enum_pages_blocks_roadmap_background";
  DROP TYPE "public"."enum_pages_blocks_flow_background";
  DROP TYPE "public"."enum_pages_blocks_card_grid_items_icon";
  DROP TYPE "public"."enum_pages_blocks_card_grid_background";
  DROP TYPE "public"."enum_pages_blocks_card_grid_style";
  DROP TYPE "public"."enum_pages_blocks_action_areas_areas_icon";
  DROP TYPE "public"."enum_pages_blocks_action_areas_background";
  DROP TYPE "public"."enum_pages_blocks_supporter_levels_background";
  DROP TYPE "public"."enum_pages_blocks_logo_grid_background";
  DROP TYPE "public"."enum_pages_blocks_logo_grid_source";
  DROP TYPE "public"."enum_pages_blocks_faq_list_background";
  DROP TYPE "public"."enum_pages_blocks_news_teaser_background";
  DROP TYPE "public"."enum_pages_blocks_form_background";
  DROP TYPE "public"."enum_pages_blocks_form_form";
  DROP TYPE "public"."enum_pages_blocks_anchor_day_background";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_style";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_background";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_layout";
  DROP TYPE "public"."enum__pages_v_blocks_host_map_countries_label_side";
  DROP TYPE "public"."enum__pages_v_blocks_host_map_background";
  DROP TYPE "public"."enum__pages_v_blocks_summit_week_background";
  DROP TYPE "public"."enum__pages_v_blocks_roadmap_steps_status";
  DROP TYPE "public"."enum__pages_v_blocks_roadmap_background";
  DROP TYPE "public"."enum__pages_v_blocks_flow_background";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_style";
  DROP TYPE "public"."enum__pages_v_blocks_action_areas_areas_icon";
  DROP TYPE "public"."enum__pages_v_blocks_action_areas_background";
  DROP TYPE "public"."enum__pages_v_blocks_supporter_levels_background";
  DROP TYPE "public"."enum__pages_v_blocks_logo_grid_background";
  DROP TYPE "public"."enum__pages_v_blocks_logo_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_faq_list_background";
  DROP TYPE "public"."enum__pages_v_blocks_news_teaser_background";
  DROP TYPE "public"."enum__pages_v_blocks_form_background";
  DROP TYPE "public"."enum__pages_v_blocks_form_form";
  DROP TYPE "public"."enum__pages_v_blocks_anchor_day_background";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_news_type";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_type";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum__partners_v_version_status";
  DROP TYPE "public"."enum_supporters_level";
  DROP TYPE "public"."enum_supporters_status";
  DROP TYPE "public"."enum__supporters_v_version_level";
  DROP TYPE "public"."enum__supporters_v_version_status";
  DROP TYPE "public"."enum_faqs_status";
  DROP TYPE "public"."enum__faqs_v_version_status";`)
}
