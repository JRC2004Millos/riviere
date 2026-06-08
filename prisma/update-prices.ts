import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRECIO_POR_CATEGORIA: Record<string, number> = {
  Oxford: 699000,   // Premium
  Traje: 699000,    // Premium
  Rayas: 599000,    // Estándar
  Cuadros: 499000,  // Outlet Premium
  Diseños: 499000,  // Outlet Premium
};

async function main() {
  for (const [categoria, precio] of Object.entries(PRECIO_POR_CATEGORIA)) {
    const result = await prisma.product.updateMany({
      where: { caracteristicas: categoria },
      data: { precio },
    });
    console.log(`${categoria}: ${result.count} productos → $${precio.toLocaleString("es-CO")}`);
  }
  console.log("\nPrecios actualizados correctamente.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
