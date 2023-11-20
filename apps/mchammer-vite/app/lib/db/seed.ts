import { makeTimings } from "~/lib/timing.server.ts";

(async () => {
  console.log("Starting drizzle seeding...");
  const timings = makeTimings("drizzle seed");
  console.log("Finished drizzle seeing!");
})().catch(console.error);
