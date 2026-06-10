-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "customerCity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "customerDepartment" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "envio" INTEGER NOT NULL DEFAULT 0;
