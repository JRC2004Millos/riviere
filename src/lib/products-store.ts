import { prisma } from "./prisma";

export type ProductOverride = {
  precio?: number;
  cantidad?: number;
  descripcion?: string;
  caracteristicas?: string;
  nombre?: string;
  material?: string | null;
};

export type MergedProduct = {
  id: string;
  estilo: string;
  patron: string;
  cantidad: number;
  tallas: string[];
  colores: string[];
  caracteristicas: string;
  mangaCorta: boolean;
  precio: number;
  estado: string;
  hasImage: boolean;
  descripcion?: string;
  nombre: string;
  material?: string;
};

function toMerged(p: {
  id: string;
  estilo: string;
  patron: string;
  cantidad: number;
  tallas: string[];
  colores: string[];
  caracteristicas: string;
  mangaCorta: boolean;
  precio: number;
  estado: string;
  hasImage: boolean;
  descripcion: string | null;
  // Optional until `prisma migrate dev` adds these columns to the client
  nombre?: string | null;
  material?: string | null;
}): MergedProduct {
  return {
    ...p,
    descripcion: p.descripcion ?? undefined,
    nombre: p.nombre ?? "",
    material: p.material ?? undefined,
  };
}

export async function getAllProducts(): Promise<MergedProduct[]> {
  const rows = await prisma.product.findMany({ orderBy: { estilo: "asc" } });
  return rows.map(toMerged);
}

export async function getProductByEstilo(
  estilo: string,
): Promise<MergedProduct | null> {
  const row = await prisma.product.findFirst({
    where: { estilo: { equals: estilo, mode: "insensitive" } },
  });
  return row ? toMerged(row) : null;
}

export async function saveProductOverride(
  estilo: string,
  override: ProductOverride,
): Promise<void> {
  await prisma.product.update({
    where: { estilo },
    data: {
      ...(override.precio !== undefined && { precio: override.precio }),
      ...(override.cantidad !== undefined && { cantidad: override.cantidad }),
      ...(override.descripcion !== undefined && {
        descripcion: override.descripcion || null,
      }),
      ...(override.caracteristicas !== undefined && {
        caracteristicas: override.caracteristicas,
      }),
      ...(override.nombre !== undefined && { nombre: override.nombre }),
      ...(override.material !== undefined && {
        material: override.material || null,
      }),
    },
  });
}
