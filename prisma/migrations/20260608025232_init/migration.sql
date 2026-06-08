-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "estilo" TEXT NOT NULL,
    "patron" TEXT NOT NULL DEFAULT '',
    "cantidad" INTEGER NOT NULL,
    "tallas" TEXT[],
    "colores" TEXT[],
    "caracteristicas" TEXT NOT NULL DEFAULT '',
    "mangaCorta" BOOLEAN NOT NULL DEFAULT false,
    "precio" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT '',
    "hasImage" BOOLEAN NOT NULL DEFAULT false,
    "descripcion" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_estilo_key" ON "products"("estilo");
