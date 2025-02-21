/*
  Warnings:

  - You are about to drop the column `jsonData` on the `notifications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Account_providerAccountId_key";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "jsonData",
ADD COLUMN     "data" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
