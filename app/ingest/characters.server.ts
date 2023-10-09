import { type Region } from "#app/constants.ts";
import { drizzle } from "#app/lib/db.server.ts";
import { character } from "#app/lib/db/schema.ts";
import { time, type Timings } from "#app/lib/timing.server.ts";
import { type PlayerDetail } from "#app/wcl/schema.server.ts";

export const findOrCreateCharacter = (
  playerDetail: PlayerDetail,
  region: Region,
  timings: Timings,
) =>
  time(
    () =>
      drizzle
        .insert(character)
        .values({
          id: playerDetail.guid,
          name: playerDetail.name,
          server: playerDetail.server,
          region,
        })
        .onConflictDoNothing()
        .returning(),
    {
      type: `findOrCreateCharacter(${playerDetail.id})`,
      timings,
    },
  );
