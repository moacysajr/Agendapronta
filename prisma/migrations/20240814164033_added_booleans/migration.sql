-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
