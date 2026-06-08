/**
 * Script de migración de datos — ejecutar UNA VEZ después de `prisma migrate dev`.
 *
 * Hace:
 *   1. Renombra "Lino" → "Oxford" y "Trajes" → "Traje"
 *   2. Genera `nombre` para todos los productos existentes
 */
import { PrismaClient } from "@prisma/client";
import { generateProductName } from "../src/lib/product-name";

const prisma = new PrismaClient();

async function main() {
  // 1. Renombrar categorías
  const lino = await prisma.product.updateMany({
    where: { caracteristicas: "Lino" },
    data: { caracteristicas: "Oxford" },
  });
  const trajes = await prisma.product.updateMany({
    where: { caracteristicas: "Trajes" },
    data: { caracteristicas: "Traje" },
  });
  console.log(
    `Renombrados: ${lino.count} "Lino"→"Oxford", ${trajes.count} "Trajes"→"Traje"`,
  );

  // 2. Generar nombre para todos los productos
  const products = await prisma.product.findMany();
  let updated = 0;

  for (const p of products) {
    const nombre = generateProductName(p.caracteristicas, p.colores, p.mangaCorta);
    await prisma.product.update({
      where: { id: p.id },
      data: { nombre },
    });
    updated++;
  }

  console.log(`Nombre generado para ${updated} productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
