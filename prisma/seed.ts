import process from "node:process";

import { regions } from "~/data/regions.ts";
import { prisma } from "~/lib/db.server.ts";

import { cleanupDb } from "../tests/db-utils.ts";

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  await cleanupDb(prisma);
  console.timeEnd("🧹 Cleaned up the database...");

  console.time("🔑 Created regions...");
  for (const region of regions) {
    await prisma.region.create({ data: { id: region } });
  }
  console.timeEnd("🔑 Created regions...");

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
