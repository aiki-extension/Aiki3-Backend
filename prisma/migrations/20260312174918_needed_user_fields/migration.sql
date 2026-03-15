/*
  Warnings:

  - You are about to drop the column `dailyLearningGoal` on the `User` table. All the data in the column will be lost.
  - Added the required column `dailyLearningGoalMinutes` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `rewardTimeMinutes` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sessionDurationMinutes` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastActive` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `operatingHoursStart` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `operatingHoursEnd` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dailyLearningGoal",
ADD COLUMN     "dailyLearningGoalMinutes" INTEGER NOT NULL,
ALTER COLUMN "rewardTimeMinutes" SET NOT NULL,
ALTER COLUMN "sessionDurationMinutes" SET NOT NULL,
ALTER COLUMN "lastActive" SET NOT NULL,
ALTER COLUMN "operatingHoursStart" SET NOT NULL,
ALTER COLUMN "operatingHoursEnd" SET NOT NULL;
