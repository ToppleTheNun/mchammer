import process from "node:process";
import { prisma } from "~/lib/storage.server.ts";

const seed = async () => {};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });
