/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserLearningSite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserLearningSite_userId_key" ON "UserLearningSite"("userId");
