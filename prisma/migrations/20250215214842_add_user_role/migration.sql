-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RENTER', 'HOST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'RENTER',
ALTER COLUMN "password" DROP NOT NULL;
