/*
  Warnings:

  - You are about to drop the column `operatingHoursEnd` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `operatingHoursStart` on the `User` table. All the data in the column will be lost.
  - Added the required column `operatingEndMinutes` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operatingStartMinutes` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "operatingHoursEnd",
DROP COLUMN "operatingHoursStart",
ADD COLUMN     "operatingEndMinutes" INTEGER NOT NULL,
ADD COLUMN     "operatingStartMinutes" INTEGER NOT NULL;
