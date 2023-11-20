DO $$ BEGIN
 CREATE TYPE "region" AS ENUM('eu', 'us', 'kr', 'tw');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "character" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"server" text NOT NULL,
	"region" "region" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dodge_parry_miss_streak" (
	"id" serial PRIMARY KEY NOT NULL,
	"report" text NOT NULL,
	"report_fight_id" integer NOT NULL,
	"report_fight_relative_start" integer DEFAULT -1 NOT NULL,
	"report_fight_relative_end" integer DEFAULT -1 NOT NULL,
	"dodge" integer NOT NULL,
	"parry" integer NOT NULL,
	"miss" integer NOT NULL,
	"streak" integer NOT NULL,
	"timestamp_start" timestamp NOT NULL,
	"timestamp_end" timestamp NOT NULL,
	"source_id" integer NOT NULL,
	"fight_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fight" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_seen_report" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"difficulty" integer NOT NULL,
	"encounter_id" integer NOT NULL,
	"friendly_players" text NOT NULL,
	"region" "region",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "idx_same_room" UNIQUE("start_time","end_time","encounter_id","friendly_players","region")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dodge_parry_miss_streak" ADD CONSTRAINT "dodge_parry_miss_streak_source_id_character_id_fk" FOREIGN KEY ("source_id") REFERENCES "character"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dodge_parry_miss_streak" ADD CONSTRAINT "dodge_parry_miss_streak_fight_id_fight_id_fk" FOREIGN KEY ("fight_id") REFERENCES "fight"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
