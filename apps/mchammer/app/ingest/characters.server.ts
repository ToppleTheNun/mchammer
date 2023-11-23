import type { PlayerDetail } from "@topplethenun/mchammer-wcl";
import { eq } from "drizzle-orm";

import { type Region } from "#app/constants.ts";
import { drizzle } from "#app/lib/db.server.ts";
import { type Character, character } from "#app/lib/db/schema.ts";
import { debug } from "#app/lib/log.server.ts";
import { time, type Timings } from "#app/lib/timing.server.ts";

const findCharacter = (
  playerDetail: PlayerDetail,
  timings: Timings,
): Promise<Character | undefined> =>
  time(
    () =>
      drizzle.query.character.findFirst({
        where: eq(character.id, playerDetail.guid),
      }),
    { type: `findCharacter(${playerDetail.guid})`, timings },
  );

export const findOrCreateCharacter = async (
  playerDetail: PlayerDetail,
  region: Region,
  timings: Timings,
): Promise<Character> => {
  const foundCharacter = await findCharacter(playerDetail, timings);
  if (foundCharacter) {
    debug("Found existing character with guid:", playerDetail.guid);
    return foundCharacter;
  }

  const insertResult = await time(
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
  const insertedCharacter = insertResult.at(0);
  if (insertedCharacter) {
    debug("Ingested character with guid:", playerDetail.guid);
    return insertedCharacter;
  }

  const lastTryCharacter = await findCharacter(playerDetail, timings);
  if (lastTryCharacter) {
    debug("Found existing character with guid:", playerDetail.guid);
    return lastTryCharacter;
  }
  throw new Error(
    `Unable to find or create character with guid: ${playerDetail.guid}`,
  );
};
