-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "WclReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTimestamp" BIGINT NOT NULL,
    "endTimestamp" BIGINT,
    "regionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WclReport_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WclFight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fightNumber" INTEGER NOT NULL,
    "relativeStartTimestamp" BIGINT NOT NULL,
    "relativeEndTimestamp" BIGINT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "encounterId" INTEGER NOT NULL,
    "friendlyPlayers" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WclFight_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "WclReport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WclDamageTakenEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "relativeTimestamp" BIGINT NOT NULL,
    "fightId" TEXT NOT NULL,
    "characterId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WclDamageTakenEvent_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "WclCharacter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WclDamageTakenEvent_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "WclFight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WclCharacter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "server" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WclCharacter_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

--------------------------------- Manual Seeding --------------------------

INSERT INTO "Region" VALUES('US');
INSERT INTO "Region" VALUES('EU');
INSERT INTO "Region" VALUES('KR');
INSERT INTO "Region" VALUES('TW');
