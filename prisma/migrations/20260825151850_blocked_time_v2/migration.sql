/*
  Warnings:

  - A unique constraint covering the columns `[barberId,date,time]` on the table `BlockedTime` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barberId` to the `BlockedTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlockedTime" ADD COLUMN     "barberId" TEXT NOT NULL,
ALTER COLUMN "time" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "BlockedTime_barberId_date_idx" ON "BlockedTime"("barberId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedTime_barberId_date_time_key" ON "BlockedTime"("barberId", "date", "time");

-- AddForeignKey
ALTER TABLE "BlockedTime" ADD CONSTRAINT "BlockedTime_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
