-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LogHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "logId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LogHistory_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LogToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LogToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Log" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LogToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_LogToTag_AB_unique" ON "_LogToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_LogToTag_B_index" ON "_LogToTag"("B");
