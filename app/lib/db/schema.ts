import {
  integer,
  pgEnum,
  pgSchema,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const mchammerSchema = pgSchema("mchammer");

export const regionEnum = pgEnum("mchammer_region", ["eu", "us", "kr", "tw"]);

export const character = mchammerSchema.table("character", {
  id: integer("id").primaryKey(),

  name: text("name").notNull(),
  server: text("server").notNull(),
  region: regionEnum("region").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export type Character = typeof character.$inferSelect;
export type NewCharacter = typeof character.$inferInsert;

export const fight = mchammerSchema.table(
  "fight",
  {
    id: serial("id").primaryKey(),

    firstSeenReport: text("first_seen_report").notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    difficulty: integer("difficulty").notNull(),
    encounterId: integer("encounter_id").notNull(),
    friendlyPlayers: text("friendly_players").notNull(),
    region: regionEnum("region"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    unq: unique("idx_same_room").on(
      t.startTime,
      t.endTime,
      t.encounterId,
      t.friendlyPlayers,
      t.region,
    ),
  }),
);
export type Fight = typeof fight.$inferSelect;
export type NewFight = typeof fight.$inferInsert;

export const dodgeParryMissStreak = mchammerSchema.table(
  "dodge_parry_miss_streak",
  {
    id: serial("id").primaryKey(),

    report: text("report").notNull(),
    reportFightId: integer("report_fight_id").notNull(),
    reportFightRelativeStart: integer("report_fight_relative_start")
      .notNull()
      .default(-1),
    reportFightRelativeEnd: integer("report_fight_relative_end")
      .notNull()
      .default(-1),
    dodge: integer("dodge").notNull(),
    parry: integer("parry").notNull(),
    miss: integer("miss").notNull(),
    streak: integer("streak").notNull(),
    timestampStart: timestamp("timestamp_start").notNull(),
    timestampEnd: timestamp("timestamp_end").notNull(),

    sourceId: integer("source_id")
      .notNull()
      .references(() => character.id),
    fightId: integer("fight_id")
      .notNull()
      .references(() => fight.id),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
);
export type DodgeParryMissStreak = typeof dodgeParryMissStreak.$inferSelect;
export type NewDodgeParryMissStreak = typeof dodgeParryMissStreak.$inferInsert;
