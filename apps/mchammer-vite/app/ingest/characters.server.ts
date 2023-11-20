import { type PlayerDetail } from "@topplethenun/mchammer-wcl";
import { eq } from "drizzle-orm";

import { type Region } from "~/constants.ts";
import { type Character, character } from "~/lib/db/schema.ts";
import { getLogger } from "~/lib/logger.server.ts";
import { pg } from "~/lib/storage.server.ts";
import { time, type Timings } from "~/lib/timing.server.ts";

const ingestCharactersLogger = getLogger(["ingest", "characters"]);

const findCharacter = (
  playerDetail: PlayerDetail,
  timings: Timings,
): Promise<Character | undefined> =>
  time(
    () =>
      pg.query.character.findFirst({
        where: eq(character.id, playerDetail.guid),
      }),
    { type: `findCharacter(${playerDetail.guid})`, timings },
  );

export const findOrCreateCharacter = async (
  playerDetail: PlayerDetail,
  region: Region,
  timings: Timings,
): Promise<Character> => {
  const logger = ingestCharactersLogger.child({ character: playerDetail.guid });

  const foundCharacter = await findCharacter(playerDetail, timings);
  if (foundCharacter) {
    logger.debug("Found existing character");
    return foundCharacter;
  }

  const insertResult = await time(
    () =>
      pg
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
    logger.debug("Ingested character");
    return insertedCharacter;
  }

  const lastTryCharacter = await findCharacter(playerDetail, timings);
  if (lastTryCharacter) {
    logger.debug("Found existing character");
    return lastTryCharacter;
  }
  throw new Error(
    `Unable to find or create character with guid: ${playerDetail.guid}`,
  );
};
