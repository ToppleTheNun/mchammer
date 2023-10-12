-- CreateEnum
CREATE TYPE "Regions" AS ENUM ('eu', 'kr', 'tw', 'us');

-- CreateTable
CREATE TABLE "DodgeParryMissStreak" (
    "id" TEXT NOT NULL,
    "report" TEXT NOT NULL,
    "reportFightId" INTEGER NOT NULL,
    "reportFightRelativeStart" INTEGER NOT NULL DEFAULT -1,
    "reportFightRelativeEnd" INTEGER NOT NULL DEFAULT -1,
    "dodge" INTEGER NOT NULL,
    "parry" INTEGER NOT NULL,
    "miss" INTEGER NOT NULL,
    "streak" INTEGER NOT NULL,
    "timestampStart" TIMESTAMP(3) NOT NULL,
    "timestampEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "fightId" TEXT NOT NULL,

    CONSTRAINT "DodgeParryMissStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "server" TEXT NOT NULL,
    "region" "Regions" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fight" (
    "id" TEXT NOT NULL,
    "firstSeenReport" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "encounterId" INTEGER NOT NULL,
    "friendlyPlayers" TEXT NOT NULL,
    "region" "Regions" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fight_startTime_endTime_encounterId_friendlyPlayers_region_key" ON "Fight"("startTime", "endTime", "encounterId", "friendlyPlayers", "region");

-- AddForeignKey
ALTER TABLE "DodgeParryMissStreak" ADD CONSTRAINT "DodgeParryMissStreak_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DodgeParryMissStreak" ADD CONSTRAINT "DodgeParryMissStreak_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
