import { remember } from "@epic-web/remember";
import { blue, green, magenta, red, yellow } from "kleur/colors";

// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from ".prisma/client";

export const prisma = remember("prisma", () => {
  // NOTE: if you change anything in this function you'll need to restart
  // the dev server to see your changes.

  // Feel free to change this log threshold to something that makes sense for you
  const logThreshold = 20;

  const client = new PrismaClient({
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  });
  client.$on("query", (e) => {
    if (e.duration < logThreshold) return;
    const color =
      e.duration < logThreshold * 1.1
        ? green
        : e.duration < logThreshold * 1.2
          ? blue
          : e.duration < logThreshold * 1.3
            ? yellow
            : e.duration < logThreshold * 1.4
              ? magenta
              : red;
    const dur = color(`${String(e.duration)}ms`);
    console.info(`prisma:query - ${dur} - ${e.query}`);
  });
  void client.$connect();
  return client;
});
