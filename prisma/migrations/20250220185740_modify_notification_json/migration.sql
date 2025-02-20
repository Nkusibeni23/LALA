/*
  Warnings:

  - You are about to drop the column `data` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "data",
ADD COLUMN     "jsonData" JSONB;
