import { PrismaClient } from "@prisma/client";
import { productos, skus } from "../src/data/productos";
import { generateProductName } from "../src/lib/product-name";

const prisma = new PrismaClient();

const RENAMES: Record<string, string> = {
  Lino: "Oxford",
  Trajes: "Traje",
};

async function main() {
  console.log(`Seeding ${productos.length} products, ${skus.length} variants...`);

  // Índice de SKUs por estilo para búsqueda rápida
  const skusByEstilo = new Map<string, typeof skus>();
  for (const sku of skus) {
    const list = skusByEstilo.get(sku.estilo) ?? [];
    list.push(sku);
    skusByEstilo.set(sku.estilo, list);
  }

  let variantCount = 0;

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
        caracteristicas,
        mangaCorta: p.mangaCorta,
        precio: p.precio,
        estado: p.estado,
        hasImage: p.hasImage,
        nombre,
      },
    });

    const productSKUs = skusByEstilo.get(p.estilo);

    if (productSKUs && productSKUs.length > 0) {
      // Usa las cantidades exactas del Excel (una fila = una variante)
      for (const sku of productSKUs) {
        await prisma.productVariant.upsert({
          where: {
            productId_talla_color: { productId: p.id, talla: sku.talla, color: sku.color },
          },
          update: {},
          create: { productId: p.id, talla: sku.talla, color: sku.color, cantidad: sku.cantidad, ubicacion: sku.ubicacion ?? "" },
        });
        variantCount++;
      }
    } else {
      // Fallback: distribución uniforme si no hay SKUs (no debería ocurrir)
      const colores = p.colores.length > 0 ? p.colores : [""];
      const numVariantes = p.tallas.length * colores.length;
      const qty = numVariantes > 0 ? Math.floor(p.cantidad / numVariantes) : 0;

      for (const talla of p.tallas) {
        for (const color of colores) {
          await prisma.productVariant.upsert({
            where: {
              productId_talla_color: { productId: p.id, talla, color },
            },
            update: {},
            create: { productId: p.id, talla, color, cantidad: qty },
          });
          variantCount++;
        }
      }
    }
  }

  console.log(`Seed complete: ${productos.length} products, ${variantCount} variants.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
