import { PrismaClient } from "@prisma/client";
import { productos } from "../src/data/productos";
import { generateProductName } from "../src/lib/product-name";

const prisma = new PrismaClient();

const RENAMES: Record<string, string> = {
  Lino: "Oxford",
  Trajes: "Traje",
};

async function main() {
  console.log(`Seeding ${productos.length} products...`);

  for (const p of productos) {
    const caracteristicas = RENAMES[p.caracteristicas] ?? p.caracteristicas;
    const nombre = generateProductName(caracteristicas, p.colores, p.mangaCorta);

    await prisma.product.upsert({
      where: { estilo: p.estilo },
      update: {},
      create: {
        id: p.id,
        estilo: p.estilo,
        patron: p.patron,
        cantidad: p.cantidad,
        tallas: p.tallas,
        colores: p.colores,
        caracteristicas,
        mangaCorta: p.mangaCorta,
        precio: p.precio,
        estado: p.estado,
        hasImage: p.hasImage,
        nombre,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
