ALTER TABLE "dodge_parry_miss_streak" RENAME COLUMN "timestamp" TO "timestamp_start";--> statement-breakpoint
ALTER TABLE "dodge_parry_miss_streak" ADD COLUMN "timestamp_end" timestamp NOT NULL;