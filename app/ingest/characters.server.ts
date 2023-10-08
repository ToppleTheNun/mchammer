import type { IngestibleReportDodgeParryMissStreak } from "#app/ingest/types.ts";
import { drizzle } from "#app/lib/db.server.ts";
import { character } from "#app/lib/db/schema.ts";
import { time, type Timings } from "#app/lib/timing.server.ts";

export const findOrCreateCharacter = (
  ingestibleStreak: IngestibleReportDodgeParryMissStreak,
  timings: Timings,
) =>
  time(
    () =>
      drizzle
        .insert(character)
        .values({
          id: ingestibleStreak.target.guid,
          name: ingestibleStreak.target.name,
          server: ingestibleStreak.target.server,
          region: ingestibleStreak.region,
        })
        .onConflictDoNothing()
        .returning(),
    {
      type: "findOrCreateCharacter",
      timings,
    },
  );
