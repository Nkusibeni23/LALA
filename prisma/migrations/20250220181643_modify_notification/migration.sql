-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "data" JSONB,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;
