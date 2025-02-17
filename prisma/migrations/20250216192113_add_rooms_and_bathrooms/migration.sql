/*
  Warnings:

  - You are about to drop the column `describe` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "describe",
ADD COLUMN     "category" TEXT;
