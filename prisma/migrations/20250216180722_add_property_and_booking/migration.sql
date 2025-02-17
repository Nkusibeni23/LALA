/*
  Warnings:

  - Added the required column `bathrooms` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rooms` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "bathrooms" INTEGER NOT NULL,
ADD COLUMN     "describe" TEXT,
ADD COLUMN     "rooms" INTEGER NOT NULL;
