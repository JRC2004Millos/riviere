/*
  Warnings:

  - You are about to drop the column `cantidad` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `colores` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `tallas` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "products" DROP COLUMN "cantidad",
DROP COLUMN "colores",
DROP COLUMN "tallas";

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "talla" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '',
    "cantidad" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_talla_color_key" ON "product_variants"("productId", "talla", "color");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
